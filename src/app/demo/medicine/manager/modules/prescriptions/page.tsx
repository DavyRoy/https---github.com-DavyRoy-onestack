'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';

// Types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: string;
  quantity: string;
  instructions: string;
  manufacturer: string;
  ndc: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientBirthDate: string;
  patientPhone: string;
  patientGender: 'male' | 'female';
  doctorName: string;
  doctorSpecialization: string;
  doctorLicense: string;
  clinic: string;
  issueDate: string;
  expirationDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  priority: 'routine' | 'urgent' | 'emergency';
  type: 'new' | 'refill' | 'controlled';
  form: 'electronic' | 'paper' | 'verbal';
  diagnosis: string;
  instructions: string;
  notes: string;
  medications: Medication[];
  refills: number;
  refillsRemaining: number;
  nextRefillDate?: string;
  pharmacyId: string;
}

export type ViewType = 'list' | 'grid';
export type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled' | 'expired';
export type PriorityFilter = 'all' | 'routine' | 'urgent' | 'emergency';
export type SortField = 'issueDate' | 'expirationDate' | 'patient' | 'doctor' | 'priority';

// Demo Data
export const pharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'Аптека №1',
    address: 'ул. Ленина, 15',
    phone: '+7 (495) 123-45-67',
    hours: '09:00-21:00'
  },
  {
    id: '2',
    name: 'Аптека Здоровья',
    address: 'пр. Мира, 28',
    phone: '+7 (495) 234-56-78',
    hours: '08:00-22:00'
  },
  {
    id: '3',
    name: 'Семейная аптека',
    address: 'ул. Садовая, 42',
    phone: '+7 (495) 345-67-89',
    hours: '08:00-20:00'
  }
];

export const prescriptions: Prescription[] = [
  {
    id: 'RX-001',
    patientName: 'Иванов Петр Сергеевич',
    patientBirthDate: '1985-03-15',
    patientPhone: '+7 (915) 123-45-67',
    patientGender: 'male',
    doctorName: 'Смирнова Анна Владимировна',
    doctorSpecialization: 'Терапевт',
    doctorLicense: 'ЛО-77-01-012345',
    clinic: 'Городская поликлиника №1',
    issueDate: '2024-01-15',
    expirationDate: '2024-04-15',
    status: 'active',
    priority: 'routine',
    type: 'new',
    form: 'electronic',
    diagnosis: 'Острый бронхит',
    instructions: 'Принимать после еды. Избегать алкоголя.',
    notes: 'Пациент имеет аллергию на пенициллин',
    medications: [
      {
        id: 'med1',
        name: 'Амоксициллин',
        dosage: '500 мг',
        form: 'таблетки',
        quantity: '20 шт',
        instructions: 'По 1 таблетке 3 раза в день',
        manufacturer: 'Фармстандарт',
        ndc: '12345-678-90'
      },
      {
        id: 'med2',
        name: 'Амброксол',
        dosage: '30 мг',
        form: 'сироп',
        quantity: '100 мл',
        instructions: 'По 10 мл 3 раза в день',
        manufacturer: 'Берлин-Хеми',
        ndc: '54321-098-76'
      }
    ],
    refills: 0,
    refillsRemaining: 0,
    pharmacyId: '1'
  },
  {
    id: 'RX-002',
    patientName: 'Петрова Мария Ивановна',
    patientBirthDate: '1978-11-22',
    patientPhone: '+7 (916) 234-56-78',
    patientGender: 'female',
    doctorName: 'Козлов Дмитрий Александрович',
    doctorSpecialization: 'Кардиолог',
    doctorLicense: 'ЛО-77-01-012346',
    clinic: 'Кардиоцентр',
    issueDate: '2024-01-10',
    expirationDate: '2024-07-10',
    status: 'active',
    priority: 'urgent',
    type: 'refill',
    form: 'electronic',
    diagnosis: 'Артериальная гипертензия',
    instructions: 'Принимать утром натощак',
    notes: 'Контроль давления ежедневно',
    medications: [
      {
        id: 'med3',
        name: 'Лизиноприл',
        dosage: '10 мг',
        form: 'таблетки',
        quantity: '30 шт',
        instructions: 'По 1 таблетке утром',
        manufacturer: 'Гедеон Рихтер',
        ndc: '67890-123-45'
      }
    ],
    refills: 3,
    refillsRemaining: 2,
    nextRefillDate: '2024-04-10',
    pharmacyId: '2'
  },
  {
    id: 'RX-003',
    patientName: 'Сидоров Алексей Петрович',
    patientBirthDate: '1992-07-30',
    patientPhone: '+7 (917) 345-67-89',
    patientGender: 'male',
    doctorName: 'Орлова Елена Викторовна',
    doctorSpecialization: 'Эндокринолог',
    doctorLicense: 'ЛО-77-01-012347',
    clinic: 'Эндокринологический диспансер',
    issueDate: '2024-01-05',
    expirationDate: '2024-01-25',
    status: 'expired',
    priority: 'routine',
    type: 'controlled',
    form: 'paper',
    diagnosis: 'Сахарный диабет 2 типа',
    instructions: 'Строго по расписанию',
    notes: 'Требуется повторный осмотр',
    medications: [
      {
        id: 'med4',
        name: 'Метформин',
        dosage: '850 мг',
        form: 'таблетки',
        quantity: '60 шт',
        instructions: 'По 1 таблетке 2 раза в день',
        manufacturer: 'Тева',
        ndc: '09876-543-21'
      }
    ],
    refills: 1,
    refillsRemaining: 0,
    pharmacyId: '3'
  },
  {
    id: 'RX-004',
    patientName: 'Кузнецова Ольга Дмитриевна',
    patientBirthDate: '1980-12-10',
    patientPhone: '+7 (918) 456-78-90',
    patientGender: 'female',
    doctorName: 'Смирнова Анна Владимировна',
    doctorSpecialization: 'Терапевт',
    doctorLicense: 'ЛО-77-01-012345',
    clinic: 'Городская поликлиника №1',
    issueDate: '2024-01-18',
    expirationDate: '2024-01-25',
    status: 'active',
    priority: 'emergency',
    type: 'new',
    form: 'electronic',
    diagnosis: 'Острая пневмония',
    instructions: 'Строгий постельный режим',
    notes: 'Срочная госпитализация при ухудшении',
    medications: [
      {
        id: 'med5',
        name: 'Цефтриаксон',
        dosage: '1 г',
        form: 'порошок для инъекций',
        quantity: '10 флаконов',
        instructions: 'Внутримышечно 2 раза в день',
        manufacturer: 'Синтез',
        ndc: '11223-445-56'
      },
      {
        id: 'med6',
        name: 'Парацетамол',
        dosage: '500 мг',
        form: 'таблетки',
        quantity: '20 шт',
        instructions: 'При температуре выше 38.5°C',
        manufacturer: 'Фармстандарт',
        ndc: '66778-899-00'
      }
    ],
    refills: 0,
    refillsRemaining: 0,
    pharmacyId: '1'
  },
  {
    id: 'RX-005',
    patientName: 'Николаев Владимир Сергеевич',
    patientBirthDate: '1975-05-20',
    patientPhone: '+7 (919) 567-89-01',
    patientGender: 'male',
    doctorName: 'Козлов Дмитрий Александрович',
    doctorSpecialization: 'Кардиолог',
    doctorLicense: 'ЛО-77-01-012346',
    clinic: 'Кардиоцентр',
    issueDate: '2023-12-20',
    expirationDate: '2024-03-20',
    status: 'completed',
    priority: 'routine',
    type: 'refill',
    form: 'electronic',
    diagnosis: 'ИБС, стенокардия напряжения',
    instructions: 'Принимать постоянно',
    notes: 'Стабильное состояние',
    medications: [
      {
        id: 'med7',
        name: 'Аспирин кардио',
        dosage: '100 мг',
        form: 'таблетки',
        quantity: '30 шт',
        instructions: 'По 1 таблетке вечером',
        manufacturer: 'Байер',
        ndc: '33445-667-78'
      },
      {
        id: 'med8',
        name: 'Аторвастатин',
        dosage: '20 мг',
        form: 'таблетки',
        quantity: '30 шт',
        instructions: 'По 1 таблетке на ночь',
        manufacturer: 'Пфайзер',
        ndc: '88990-112-23'
      }
    ],
    refills: 6,
    refillsRemaining: 5,
    nextRefillDate: '2024-03-20',
    pharmacyId: '2'
  }
];

// Utility Functions
export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        label: 'Активный', 
        icon: '✅', 
        color: 'border-green-500/30 bg-green-500/10 text-green-400' 
      };
    case 'completed':
      return { 
        label: 'Завершен', 
        icon: '📁', 
        color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' 
      };
    case 'cancelled':
      return { 
        label: 'Отменен', 
        icon: '❌', 
        color: 'border-red-500/30 bg-red-500/10 text-red-400' 
      };
    case 'expired':
      return { 
        label: 'Истек', 
        icon: '⏰', 
        color: 'border-orange-500/30 bg-orange-500/10 text-orange-400' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'border-gray-500/30 bg-gray-500/10 text-gray-400' 
      };
  }
};

export const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'routine':
      return { 
        label: 'Обычный', 
        icon: '💊', 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
      };
    case 'urgent':
      return { 
        label: 'Срочный', 
        icon: '⚠️', 
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
      };
    case 'emergency':
      return { 
        label: 'Экстренный', 
        icon: '🚨', 
        color: 'bg-red-500/20 text-red-400 border-red-500/30' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
      };
  }
};

export const getTypeConfig = (type: string) => {
  switch (type) {
    case 'new':
      return { 
        label: 'Новый', 
        icon: '🆕', 
        color: 'bg-green-500/20 text-green-400 border-green-500/30' 
      };
    case 'refill':
      return { 
        label: 'Возобновление', 
        icon: '🔄', 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
      };
    case 'controlled':
      return { 
        label: 'Контролируемый', 
        icon: '🔒', 
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
      };
  }
};

export const getFormConfig = (form: string) => {
  switch (form) {
    case 'electronic':
      return { 
        label: 'Электронный', 
        icon: '💻', 
        color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
      };
    case 'paper':
      return { 
        label: 'Бумажный', 
        icon: '📄', 
        color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
      };
    case 'verbal':
      return { 
        label: 'Устный', 
        icon: '🗣️', 
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
      };
    default:
      return { 
        label: 'Неизвестно', 
        icon: '❓', 
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
      };
  }
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const getActivePrescriptions = (): Prescription[] => {
  return prescriptions.filter(p => p.status === 'active');
};

export const getExpiringPrescriptions = (days: number = 7): Prescription[] => {
  const today = new Date();
  const threshold = new Date();
  threshold.setDate(today.getDate() + days);
  
  return prescriptions.filter(p => {
    const expDate = new Date(p.expirationDate);
    return p.status === 'active' && expDate <= threshold && expDate >= today;
  });
};

export const getUrgentPrescriptions = (): Prescription[] => {
  return prescriptions.filter(p => p.priority === 'urgent' || p.priority === 'emergency');
};

export const canRefill = (prescription: Prescription): boolean => {
  return prescription.refillsRemaining > 0 && prescription.status === 'active';
};

// Main Component
export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortBy, setSortBy] = useState<SortField>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [view, setView] = useState<ViewType>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиента после гидратации
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Фильтрация и сортировка рецептов
  const filteredPrescriptions = useMemo(() => {
    let filtered = prescriptions.filter(prescription => {
      const matchesSearch = prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prescription.medications.some(med => 
                             med.name.toLowerCase().includes(searchQuery.toLowerCase())
                           ) ||
                           prescription.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || prescription.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'issueDate':
          aValue = new Date(a.issueDate).getTime();
          bValue = new Date(b.issueDate).getTime();
          break;
        case 'expirationDate':
          aValue = new Date(a.expirationDate).getTime();
          bValue = new Date(b.expirationDate).getTime();
          break;
        case 'patient':
          aValue = a.patientName.toLowerCase();
          bValue = b.patientName.toLowerCase();
          break;
        case 'doctor':
          aValue = a.doctorName.toLowerCase();
          bValue = b.doctorName.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { emergency: 0, urgent: 1, routine: 2 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        default:
          aValue = new Date(a.issueDate).getTime();
          bValue = new Date(b.issueDate).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, priorityFilter, sortBy, sortDirection]);

  // Статистика
  const stats = useMemo(() => {
    const active = getActivePrescriptions();
    const expiring = getExpiringPrescriptions(7);
    const urgent = getUrgentPrescriptions();
    
    return {
      total: prescriptions.length,
      active: active.length,
      expiring: expiring.length,
      urgent: urgent.length,
      completed: prescriptions.filter(p => p.status === 'completed').length,
      cancelled: prescriptions.filter(p => p.status === 'cancelled').length,
      withRefills: prescriptions.filter(p => p.refillsRemaining > 0).length,
    };
  }, []);

  const handleFilterReset = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setShowFilters(false);
  }, []);

  const handlePrescriptionSelect = useCallback((prescription: Prescription) => {
    setSelectedPrescription(prescription);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedPrescription(null);
  }, []);

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Всегда показываем фильтры на десктопе, только на мобильных используем состояние
  const shouldShowFilters = showFilters || (isClient && typeof window !== 'undefined' && window.innerWidth >= 1024);

  const statsData = [
    { label: 'Всего рецептов', value: stats.total, icon: '📋', color: 'from-blue-500 to-cyan-500' },
    { label: 'Активные', value: stats.active, icon: '✅', color: 'from-green-500 to-emerald-500' },
    { label: 'Истекают', value: stats.expiring, icon: '⏰', color: 'from-orange-500 to-orange-600' },
    { label: 'Срочные', value: stats.urgent, icon: '🚨', color: 'from-red-500 to-red-600' },
    { label: 'Завершены', value: stats.completed, icon: '📁', color: 'from-gray-500 to-gray-600' },
    { label: 'Отменены', value: stats.cancelled, icon: '❌', color: 'from-red-500 to-pink-600' },
    { label: 'С возобновлением', value: stats.withRefills, icon: '🔄', color: 'from-purple-500 to-purple-600' }
  ];

  const viewOptions = [
    { value: 'list' as ViewType, label: 'Список', icon: '📋' },
    { value: 'grid' as ViewType, label: 'Сетка', icon: '⏹️' }
  ];

  const filterOptions = [
    {
      label: 'Статус рецепта',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'Все статусы' },
        { value: 'active', label: 'Активные' },
        { value: 'completed', label: 'Завершенные' },
        { value: 'cancelled', label: 'Отмененные' },
        { value: 'expired', label: 'Истекшие' }
      ]
    },
    {
      label: 'Приоритет',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'Все приоритеты' },
        { value: 'routine', label: 'Обычный' },
        { value: 'urgent', label: 'Срочный' },
        { value: 'emergency', label: 'Экстренный' }
      ]
    },
    {
      label: 'Сортировка',
      value: sortBy,
      onChange: setSortBy,
      options: [
        { value: 'issueDate', label: 'По дате выписки' },
        { value: 'expirationDate', label: 'По сроку действия' },
        { value: 'patient', label: 'По пациенту' },
        { value: 'doctor', label: 'По врачу' },
        { value: 'priority', label: 'По приоритету' }
      ]
    },
    {
      label: 'Направление',
      value: sortDirection,
      onChange: setSortDirection,
      options: [
        { value: 'desc', label: 'Сначала новые' },
        { value: 'asc', label: 'Сначала старые' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Управление рецептами</h1>
              <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                Выписка, отслеживание и управление медицинскими рецептами
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className={`relative flex-1 transition-all duration-300 ${
                isSearchFocused ? 'sm:max-w-full' : 'sm:max-w-xs'
              }`}>
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                  </button>
                )}
              </div>
              
              <Link
                href="/demo/medicine/manager"
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2 min-w-[120px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Назад</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-3 sm:gap-4 flex-1">
            {/* Mobile Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Фильтры {showFilters ? '▲' : '▼'}</span>
            </motion.button>

            {/* Filters */}
            <div className={`${shouldShowFilters ? 'grid' : 'hidden lg:grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1 transition-all duration-300`}>
              {filterOptions.map((filter, index) => (
                <motion.div
                  key={filter.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex flex-col"
                >
                  <label className="text-xs text-white/60 mb-2 font-medium">{filter.label}</label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm appearance-none cursor-pointer"
                  >
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              {/* View Toggle */}
              <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
                {viewOptions.map(({ value, label, icon }) => (
                  <motion.button
                    key={value}
                    onClick={() => setView(value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 min-w-0 ${
                      view === value
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    <span className="hidden xs:inline text-sm">{label}</span>
                  </motion.button>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Новый рецепт</span>
                <span className="sm:hidden">Новый</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={stat.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <span className="text-sm">{stat.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-bold text-white truncate">{stat.value}</div>
                  <div className="text-white/60 text-xs truncate">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Prescriptions List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          {view === 'list' ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/60 text-sm font-medium">
                <div className="col-span-3">Пациент & Препараты</div>
                <div className="col-span-2">Врач & Диагноз</div>
                <div className="col-span-2">Срок действия</div>
                <div className="col-span-2">Статус & Приоритет</div>
                <div className="col-span-2">Возобновления</div>
                <div className="col-span-1">Действия</div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-white/10">
                {filteredPrescriptions.map((prescription, index) => (
                  <PrescriptionRow
                    key={prescription.id}
                    prescription={prescription}
                    index={index}
                    onSelect={handlePrescriptionSelect}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredPrescriptions.map((prescription, index) => (
                <PrescriptionGrid
                  key={prescription.id}
                  prescription={prescription}
                  index={index}
                  onSelect={handlePrescriptionSelect}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredPrescriptions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl sm:text-3xl mb-4 mx-auto">
                💊
              </div>
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Рецепты не найдены</h3>
              <p className="text-white/60 text-sm sm:text-base mb-6 max-w-xs mx-auto">
                Попробуйте изменить параметры поиска или фильтры
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFilterReset}
                className="px-6 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm font-medium"
              >
                Сбросить фильтры
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Prescription Detail Modal */}
      <AnimatePresence>
        {selectedPrescription && (
          <PrescriptionDetailModal
            prescription={selectedPrescription}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Prescription Row Component
function PrescriptionRow({ prescription, index, onSelect }: any) {
  const statusConfig = getStatusConfig(prescription.status);
  const priorityConfig = getPriorityConfig(prescription.priority);
  const age = calculateAge(prescription.patientBirthDate);
  const canBeRefilled = canRefill(prescription);
  const daysUntilExpiry = Math.ceil((new Date(prescription.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleClick = useCallback(() => {
    onSelect(prescription);
  }, [onSelect, prescription]);

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for prescription ${prescription.id}`);
  }, [prescription.id]);

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 p-4 sm:p-6 hover:bg-white/5 transition-colors cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-base mb-1">
              {prescription.patientName}
            </h3>
            <div className="text-white/60 text-sm">
              {age} лет • {prescription.doctorName}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 ml-2`}>
            {statusConfig.icon}
          </span>
        </div>

        {/* Medications */}
        <div>
          <div className="text-white/60 text-xs mb-1">Препараты</div>
          <div className="text-white text-sm line-clamp-2">
            {prescription.medications.map((med: any) => med.name).join(', ')}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/60 text-xs">Срок действия</div>
            <div className={`font-medium text-sm ${
              daysUntilExpiry <= 3 ? 'text-red-400' : 
              daysUntilExpiry <= 7 ? 'text-orange-400' : 'text-white'
            }`}>
              {new Date(prescription.expirationDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          
          <div>
            <div className="text-white/60 text-xs">Приоритет</div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
              {priorityConfig.icon} {priorityConfig.label}
            </div>
          </div>
        </div>

        {/* Refills & Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div>
            <div className="text-white/60 text-xs mb-1">Возобновления</div>
            <div className="text-white font-medium text-sm">
              {prescription.refillsRemaining}/{prescription.refills}
              {canBeRefilled && (
                <span className="text-green-400 text-xs ml-2">✓</span>
              )}
            </div>
          </div>
          <button 
            onClick={(e) => handleActionClick(e, 'view')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            aria-label="Просмотр рецепта"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <>
        {/* Patient & Medications */}
        <div className="hidden sm:block col-span-3">
          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
            {prescription.patientName}
          </div>
          <div className="text-white/60 text-sm">
            {age} лет, {prescription.patientPhone}
          </div>
          <div className="text-white/80 text-sm mt-1 truncate" title={prescription.medications.map((med: any) => med.name).join(', ')}>
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {prescription.medications.map((med: any) => med.name).join(', ')}
          </div>
        </div>

        {/* Doctor & Diagnosis */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium text-sm truncate">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {prescription.doctorName}
          </div>
          <div className="text-white/60 text-sm">{prescription.doctorSpecialization}</div>
          <div className="text-white/60 text-xs mt-1 truncate" title={prescription.diagnosis}>
            {prescription.diagnosis}
          </div>
        </div>

        {/* Dates */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium text-sm">
            Выписан: {new Date(prescription.issueDate).toLocaleDateString('ru-RU')}
          </div>
          <div className={`text-sm ${
            daysUntilExpiry <= 3 ? 'text-red-400' : 
            daysUntilExpiry <= 7 ? 'text-orange-400' : 'text-white/60'
          }`}>
            Действует до: {new Date(prescription.expirationDate).toLocaleDateString('ru-RU')}
            {daysUntilExpiry > 0 && (
              <span className="text-white/40 text-xs ml-1">({daysUntilExpiry} д.)</span>
            )}
          </div>
        </div>

        {/* Status & Priority */}
        <div className="hidden sm:block col-span-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} mb-2 inline-block`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
            {priorityConfig.icon} {priorityConfig.label}
          </div>
        </div>

        {/* Refills */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white/60 text-sm mb-1">Возобновления</div>
          <div className="flex items-center gap-2">
            <div className="text-white font-medium">
              {prescription.refillsRemaining}/{prescription.refills}
            </div>
            {canBeRefilled && (
              <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                Доступно
              </span>
            )}
          </div>
          {prescription.nextRefillDate && (
            <div className="text-white/60 text-xs">
              Следующее: {new Date(prescription.nextRefillDate).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="hidden sm:flex col-span-1 items-center justify-end">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => handleActionClick(e, 'view')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="Просмотр рецепта"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {canBeRefilled && (
              <button 
                onClick={(e) => handleActionClick(e, 'refill')}
                className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 hover:border-green-500/50 transition-colors text-green-400 hover:text-green-300"
                title="Возобновить рецепт"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button 
              onClick={(e) => handleActionClick(e, 'print')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="Печать рецепта"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
        </div>
      </>
    </motion.div>
  );
}

// Prescription Grid Component
function PrescriptionGrid({ prescription, index, onSelect }: any) {
  const statusConfig = getStatusConfig(prescription.status);
  const priorityConfig = getPriorityConfig(prescription.priority);
  const age = calculateAge(prescription.patientBirthDate);
  const canBeRefilled = canRefill(prescription);
  const daysUntilExpiry = Math.ceil((new Date(prescription.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleClick = useCallback(() => {
    onSelect(prescription);
  }, [onSelect, prescription]);

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for prescription ${prescription.id}`);
  }, [prescription.id]);

  return (
    <motion.div
      variants={{
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
          scale: 1,
          opacity: 1,
          transition: {
            duration: 0.4,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base truncate">
            {prescription.patientName}
          </h3>
          <div className="text-white/60 text-sm">
            {age} лет • {prescription.doctorName}
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 ml-2`}>
          {statusConfig.icon} {statusConfig.label}
        </span>
      </div>

      {/* Priority & Dates */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
          {priorityConfig.icon} {priorityConfig.label}
        </span>
        <div className="text-right">
          <div className="text-white/60 text-xs">Срок действия</div>
          <div className={`text-sm font-medium ${
            daysUntilExpiry <= 3 ? 'text-red-400' : 
            daysUntilExpiry <= 7 ? 'text-orange-400' : 'text-white'
          }`}>
            {new Date(prescription.expirationDate).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-3">
        <div className="text-white/60 text-xs mb-1">Диагноз</div>
        <div className="text-white text-sm line-clamp-2">
          {prescription.diagnosis}
        </div>
      </div>

      {/* Medications */}
      <div className="mb-4">
        <div className="text-white/60 text-xs mb-2">Препараты</div>
        <div className="space-y-1">
          {prescription.medications.slice(0, 2).map((med: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-white truncate flex-1">{med.name}</span>
              <span className="text-white/60 text-xs ml-2 flex-shrink-0">
                {med.dosage}
              </span>
            </div>
          ))}
          {prescription.medications.length > 2 && (
            <div className="text-white/60 text-xs">
              +{prescription.medications.length - 2} еще
            </div>
          )}
        </div>
      </div>

      {/* Refills & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          <div className="text-white/60 text-xs mb-1">Возобновления</div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">
              {prescription.refillsRemaining}/{prescription.refills}
            </span>
            {canBeRefilled && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                ✓
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => handleActionClick(e, 'view')}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            aria-label="Просмотр рецепта"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          {canBeRefilled && (
            <button 
              onClick={(e) => handleActionClick(e, 'refill')}
              className="p-1.5 rounded-lg bg-green-500/20 border border-green-500/30 hover:border-green-500/50 transition-colors text-green-400 hover:text-green-300"
              aria-label="Возобновить рецепт"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Prescription Detail Modal Component
function PrescriptionDetailModal({ prescription, onClose }: any) {
  const statusConfig = getStatusConfig(prescription.status);
  const priorityConfig = getPriorityConfig(prescription.priority);
  const typeConfig = getTypeConfig(prescription.type);
  const formConfig = getFormConfig(prescription.form);
  const age = calculateAge(prescription.patientBirthDate);
  const canBeRefilled = canRefill(prescription);
  const daysUntilExpiry = Math.ceil((new Date(prescription.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleAction = useCallback((action: string) => {
    console.log(`${action} action for prescription ${prescription.id}`);
    // Здесь будет логика действий
  }, [prescription.id]);

  const getPharmacy = (pharmacyId: string) => {
    return pharmacies.find(p => p.id === pharmacyId) || pharmacies[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${statusConfig.color} flex items-center justify-center text-white`}>
              <span className="text-lg sm:text-xl">{statusConfig.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                Рецепт #{prescription.id}
              </h2>
              <p className="text-white/60 text-sm truncate">
                {prescription.patientName} • {prescription.doctorName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center text-white/60 hover:text-white"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Информация о пациенте
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">ФИО:</span>
                    <span className="text-white font-medium">{prescription.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Возраст:</span>
                    <span className="text-white">{age} лет</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Телефон:</span>
                    <span className="text-white">{prescription.patientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Пол:</span>
                    <span className="text-white">{prescription.patientGender === 'male' ? 'Мужской' : 'Женский'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Лечащий врач
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">ФИО:</span>
                    <span className="text-white font-medium">{prescription.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Специализация:</span>
                    <span className="text-white">{prescription.doctorSpecialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Лицензия:</span>
                    <span className="text-white">{prescription.doctorLicense}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Клиника:</span>
                    <span className="text-white">{prescription.clinic}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescription Details */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Детали рецепта
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-white/60 text-xs mb-1">Статус</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                </div>
                <div>
                  <div className="text-white/60 text-xs mb-1">Приоритет</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                    {priorityConfig.icon} {priorityConfig.label}
                  </span>
                </div>
                <div>
                  <div className="text-white/60 text-xs mb-1">Тип</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                    {typeConfig.icon} {typeConfig.label}
                  </span>
                </div>
                <div>
                  <div className="text-white/60 text-xs mb-1">Форма</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${formConfig.color}`}>
                    {formConfig.icon} {formConfig.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                <div>
                  <div className="text-white/60 text-xs mb-1">Дата выписки</div>
                  <div className="text-white font-medium">
                    {new Date(prescription.issueDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs mb-1">Срок действия</div>
                  <div className={`font-medium ${
                    daysUntilExpiry <= 3 ? 'text-red-400' : 
                    daysUntilExpiry <= 7 ? 'text-orange-400' : 'text-white'
                  }`}>
                    {new Date(prescription.expirationDate).toLocaleDateString('ru-RU')}
                    {daysUntilExpiry > 0 && (
                      <span className="text-white/60 text-xs ml-1">({daysUntilExpiry} д.)</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs mb-1">Возобновления</div>
                  <div className="text-white font-medium">
                    {prescription.refillsRemaining}/{prescription.refills}
                    {canBeRefilled && (
                      <span className="text-green-400 text-xs ml-2">✓ Доступно</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis & Instructions */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Диагноз и инструкции</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-white/60 text-xs mb-1">Диагноз</div>
                  <div className="text-white">{prescription.diagnosis}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs mb-1">Инструкции врача</div>
                  <div className="text-white">{prescription.instructions}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs mb-1">Примечания</div>
                  <div className="text-white">{prescription.notes || 'Нет примечаний'}</div>
                </div>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Назначенные препараты</h3>
              <div className="space-y-3">
                {prescription.medications.map((med: any, index: number) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm mb-1">{med.name}</div>
                      <div className="text-white/60 text-xs space-y-1">
                        <div>Дозировка: {med.dosage}</div>
                        <div>Форма: {med.form}</div>
                        <div>Количество: {med.quantity}</div>
                        {med.instructions && (
                          <div>Инструкция: {med.instructions}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/60 flex-shrink-0 ml-3">
                      <div>{med.manufacturer}</div>
                      <div className="text-white/40">#{med.ndc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pharmacy */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Рекомендуемая аптека</h3>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {getPharmacy(prescription.pharmacyId).name}
                    </div>
                    <div className="text-white/60 text-xs">
                      {getPharmacy(prescription.pharmacyId).address}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-white/60">Телефон</div>
                  <div className="text-white">{getPharmacy(prescription.pharmacyId).phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 sm:p-6 border-t border-white/10 bg-slate-900/50">
          <button
            onClick={() => handleAction('print')}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white font-medium text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Печать
          </button>
          {canBeRefilled && (
            <button
              onClick={() => handleAction('refill')}
              className="flex-1 px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 hover:border-green-500/50 transition-colors text-green-400 font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Возобновить
            </button>
          )}
          <button
            onClick={() => handleAction('share')}
            className="flex-1 px-4 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors text-blue-400 font-medium text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Поделиться
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}