'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { patients, appointments, doctors, Patient, Appointment } from './demo-data';

type SortField = 'name' | 'lastVisit' | 'appointmentsCount' | 'status';
type SortDirection = 'asc' | 'desc';
type PatientStatus = 'active' | 'inactive' | 'new';
type ViewType = 'grid' | 'list';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [view, setView] = useState<ViewType>('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиента после гидратации
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Обогащаем пациентов дополнительными данными
  const enrichedPatients = useMemo(() => {
    return patients.map(patient => {
      const patientAppointments = appointments.filter(apt => apt.patientName === patient.name);
      const lastAppointment = patientAppointments
        .filter(apt => apt.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      const upcomingAppointments = patientAppointments
        .filter(apt => apt.status === 'scheduled')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const status: PatientStatus = patientAppointments.length === 0 ? 'new' : 
                                 lastAppointment && new Date().getTime() - new Date(lastAppointment.date).getTime() > 90 * 24 * 60 * 60 * 1000 ? 'inactive' : 'active';

      return {
        ...patient,
        appointmentsCount: patientAppointments.length,
        lastVisit: lastAppointment?.date,
        upcomingAppointments,
        status
      };
    });
  }, []);

  // Фильтрация и сортировка
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = enrichedPatients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           patient.phone.includes(searchQuery) ||
                           patient.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'lastVisit') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (sortField === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [enrichedPatients, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const getStatusColor = useCallback((status: PatientStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  }, []);

  const getStatusIcon = useCallback((status: PatientStatus) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '⚫';
      case 'new': return '🆕';
      default: return '❓';
    }
  }, []);

  const calculateAge = useCallback((birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }, []);

  const handleFilterReset = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  const handlePatientSelect = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedPatient(null);
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const stats = [
    { label: 'Всего пациентов', value: enrichedPatients.length, icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Активные', value: enrichedPatients.filter(p => p.status === 'active').length, icon: '🟢', color: 'from-green-500 to-emerald-500' },
    { label: 'Новые', value: enrichedPatients.filter(p => p.status === 'new').length, icon: '🆕', color: 'from-purple-500 to-purple-600' },
    { label: 'Неактивные', value: enrichedPatients.filter(p => p.status === 'inactive').length, icon: '⚫', color: 'from-gray-500 to-gray-600' }
  ];

  const viewOptions = [
    { value: 'grid' as ViewType, label: 'Сетка', icon: '⏹️' },
    { value: 'list' as ViewType, label: 'Список', icon: '📋' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Имя А-Я' },
    { value: 'name-desc', label: 'Имя Я-А' },
    { value: 'lastVisit-desc', label: 'Последний визит (новые)' },
    { value: 'lastVisit-asc', label: 'Последний визит (старые)' },
    { value: 'appointmentsCount-desc', label: 'Кол-во записей (убыв.)' },
    { value: 'appointmentsCount-asc', label: 'Кол-во записей (возр.)' }
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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Управление пациентами</h1>
              <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                База пациентов и история обращений
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Search */}
              <div className={`relative flex-1 transition-all duration-300 ${
                isSearchFocused ? 'sm:max-w-full' : 'sm:max-w-xs'
              }`}>
                
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/40">
                </div>
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {/* Status Filter */}
              <div className="flex flex-col flex-1 sm:flex-none">
                <label className="text-xs text-white/60 mb-2 font-medium">Статус</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm appearance-none cursor-pointer"
                >
                  <option value="all">Все статусы</option>
                  <option value="active">Активные</option>
                  <option value="inactive">Неактивные</option>
                  <option value="new">Новые</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex flex-col flex-1 sm:flex-none">
                <label className="text-xs text-white/60 mb-2 font-medium">Вид</label>
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
              </div>
            </div>

            {/* Sort */}
            <div className="flex flex-col flex-1">
              <label className="text-xs text-white/60 mb-2 font-medium">Сортировка</label>
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortField(field as SortField);
                  setSortDirection(direction as SortDirection);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-white text-sm appearance-none cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">Отчёт</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 min-w-[140px]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Новый пациент</span>
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
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {stats.map((stat, index) => (
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

        {/* Patients Grid/List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredAndSortedPatients.map((patient, index) => (
                <PatientGridCard
                  key={patient.id}
                  patient={patient}
                  index={index}
                  onSelect={handlePatientSelect}
                  calculateAge={calculateAge}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-white/60 text-sm font-medium">
                <div className="col-span-4">Пациент</div>
                <div className="col-span-2">Контакты</div>
                <div className="col-span-2">Статус</div>
                <div className="col-span-2">Записи</div>
                <div className="col-span-2">Последний визит</div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-white/10">
                {filteredAndSortedPatients.map((patient, index) => (
                  <PatientListRow
                    key={patient.id}
                    patient={patient}
                    index={index}
                    onSelect={handlePatientSelect}
                    calculateAge={calculateAge}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedPatients.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl sm:text-3xl mb-4 mx-auto">
                👥
              </div>
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Пациенты не найдены</h3>
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

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <PatientDetailModal
            patient={selectedPatient}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Patient Grid Card Component
interface PatientGridCardProps {
  patient: any;
  index: number;
  onSelect: (patient: any) => void;
  calculateAge: (birthDate: string) => number;
  getStatusColor: (status: PatientStatus) => string;
  getStatusIcon: (status: PatientStatus) => string;
}

function PatientGridCard({ patient, index, onSelect, calculateAge, getStatusColor, getStatusIcon }: PatientGridCardProps) {
  const handleClick = useCallback(() => {
    onSelect(patient);
  }, [onSelect, patient]);

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      custom={index}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer group hover:border-white/20"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg flex-shrink-0">
            {patient.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors truncate mb-1">
              {patient.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)} whitespace-nowrap`}>
                {getStatusIcon(patient.status)} {patient.status === 'active' ? 'Активный' : patient.status === 'inactive' ? 'Неактивный' : 'Новый'}
              </span>
              <span className="text-white/60 text-sm whitespace-nowrap">
                {calculateAge(patient.birthDate)} лет
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-white/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-sm truncate">{patient.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm truncate">{patient.email}</span>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-sm">{patient.insurance}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="text-white/60 text-sm">
          {patient.appointmentsCount} записей
        </div>
        <div className="text-white/60 text-sm">
          {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('ru-RU') : 'Не было'}
        </div>
      </div>

      {patient.upcomingAppointments.length > 0 && (
        <div className="mt-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="text-blue-400 text-xs font-medium">
            Ближайшая запись: {new Date(patient.upcomingAppointments[0].date).toLocaleDateString('ru-RU')} в {patient.upcomingAppointments[0].startTime}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Patient List Row Component
function PatientListRow({ patient, index, onSelect, calculateAge, getStatusColor, getStatusIcon }: PatientGridCardProps) {
  const handleClick = useCallback(() => {
    onSelect(patient);
  }, [onSelect, patient]);

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
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
              {patient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">{patient.name}</h3>
              <div className="text-white/60 text-sm">
                {calculateAge(patient.birthDate)} лет • {patient.gender === 'male' ? 'Мужчина' : 'Женщина'}
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)} flex-shrink-0`}>
            {getStatusIcon(patient.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/60 text-xs mb-1">Контакты</div>
            <div className="text-white font-medium text-sm">{patient.phone}</div>
            <div className="text-white/60 text-xs truncate">{patient.email}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs mb-1">Статистика</div>
            <div className="text-white font-medium text-sm">{patient.appointmentsCount} записей</div>
            <div className="text-white/60 text-xs">
              {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('ru-RU') : 'Не было'}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <>
        <div className="hidden sm:flex col-span-4 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {patient.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
              {patient.name}
            </div>
            <div className="text-white/60 text-sm">
              {calculateAge(patient.birthDate)} лет • {patient.gender === 'male' ? 'Мужчина' : 'Женщина'}
            </div>
          </div>
        </div>
        
        <div className="hidden sm:block col-span-2 text-white/80 text-sm">
          <div>{patient.phone}</div>
          <div className="truncate" title={patient.email}>{patient.email}</div>
        </div>
        
        <div className="hidden sm:block col-span-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
            {getStatusIcon(patient.status)} {patient.status === 'active' ? 'Активный' : patient.status === 'inactive' ? 'Неактивный' : 'Новый'}
          </span>
        </div>
        
        <div className="hidden sm:block col-span-2 text-white/80 text-sm">
          {patient.appointmentsCount} записей
        </div>
        
        <div className="hidden sm:block col-span-2 text-white/80 text-sm">
          {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('ru-RU') : 'Не было'}
        </div>
      </>
    </motion.div>
  );
}

// Patient Detail Modal Component
interface PatientDetailModalProps {
  patient: Patient & {
    appointmentsCount: number;
    lastVisit?: string;
    upcomingAppointments: Appointment[];
    status: PatientStatus;
  };
  onClose: () => void;
}

function PatientDetailModal({ patient, onClose }: PatientDetailModalProps) {
  // Добавляем обработчик закрытия по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const patientAppointments = appointments.filter(apt => apt.patientName === patient.name);
  const medicalAlerts = [
    ...patient.allergies.map(allergy => ({ type: 'allergy' as const, text: allergy })),
    ...patient.medicalHistory.map(history => ({ type: 'condition' as const, text: history }))
  ];

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white">Карта пациента</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Основная информация</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/60 text-xs sm:text-sm mb-1">ФИО</div>
                    <div className="text-white font-medium text-sm sm:text-base">{patient.name}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs sm:text-sm mb-1">Возраст</div>
                    <div className="text-white font-medium text-sm sm:text-base">{calculateAge(patient.birthDate)} лет</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs sm:text-sm mb-1">Пол</div>
                    <div className="text-white font-medium text-sm sm:text-base">{patient.gender === 'male' ? 'Мужской' : 'Женский'}</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs sm:text-sm mb-1">Дата рождения</div>
                    <div className="text-white font-medium text-sm sm:text-base">{new Date(patient.birthDate).toLocaleDateString('ru-RU')}</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Контактная информация</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-white text-sm sm:text-base">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-sm sm:text-base">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-white text-sm sm:text-base">{patient.insurance}</span>
                  </div>
                </div>
              </div>

              {/* Medical Alerts */}
              {medicalAlerts.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Медицинские алерты</h3>
                  <div className="space-y-2">
                    {medicalAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          alert.type === 'allergy' 
                            ? 'bg-red-500/10 border border-red-500/20' 
                            : 'bg-yellow-500/10 border border-yellow-500/20'
                        }`}
                      >
                        <span className={alert.type === 'allergy' ? 'text-red-400' : 'text-yellow-400'}>
                          {alert.type === 'allergy' ? '⚠️' : '💊'}
                        </span>
                        <span className="text-white text-xs sm:text-sm">{alert.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Экстренный контакт</h3>
                <div className="space-y-2">
                  <div className="text-white font-medium text-sm sm:text-base">{patient.emergencyContact.name}</div>
                  <div className="text-white/60 text-xs sm:text-sm">{patient.emergencyContact.relationship}</div>
                  <div className="text-white/80 text-sm sm:text-base">{patient.emergencyContact.phone}</div>
                </div>
              </div>

              {/* Appointment Stats */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Статистика записей</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60 text-xs sm:text-sm">Всего записей:</span>
                    <span className="text-white font-medium text-sm sm:text-base">{patient.appointmentsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-xs sm:text-sm">Последний визит:</span>
                    <span className="text-white font-medium text-sm sm:text-base">
                      {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('ru-RU') : 'Не было'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60 text-xs sm:text-sm">Предстоящие:</span>
                    <span className="text-white font-medium text-sm sm:text-base">{patient.upcomingAppointments.length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Быстрые действия</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors text-xs sm:text-sm">
                    📅 Записать на приём
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors text-xs sm:text-sm">
                    📝 Создать заметку
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors text-xs sm:text-sm">
                    📊 История болезней
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="mt-6 bg-white/5 rounded-xl p-4">
            <h3 className="font-semibold text-white text-sm sm:text-base mb-4">История обращений</h3>
            <div className="space-y-2">
              {patientAppointments.slice(0, 5).map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm sm:text-base">{appointment.doctorName}</div>
                    <div className="text-white/60 text-xs sm:text-sm truncate">{appointment.reason}</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-white text-xs sm:text-sm whitespace-nowrap">{appointment.date} в {appointment.startTime}</div>
                    <div className={`text-xs ${
                      appointment.status === 'completed' ? 'text-green-400' :
                      appointment.status === 'scheduled' ? 'text-blue-400' :
                      appointment.status === 'cancelled' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {appointment.status === 'completed' ? 'Завершён' :
                       appointment.status === 'scheduled' ? 'Запланирован' :
                       appointment.status === 'cancelled' ? 'Отменён' : 'Не явился'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}