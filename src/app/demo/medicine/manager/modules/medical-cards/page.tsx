'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { 
  medicalCards, 
  MedicalCard, 
  getMedicalHistoryByCardId, 
  getAllergiesByCardId, 
  getChronicDiseasesByCardId, 
  getLabResultsByCardId,
  calculateAge,
  getStatusConfig,
  getBloodTypeConfig
} from './demo-data';

type ViewType = 'list' | 'grid';
type StatusFilter = 'all' | 'active' | 'archived' | 'temporary';
type SortField = 'name' | 'lastVisit' | 'createdAt' | 'status';

export default function MedicalCardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCard, setSelectedCard] = useState<MedicalCard | null>(null);
  const [view, setView] = useState<ViewType>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Устанавливаем флаг клиента после гидратации
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Фильтрация и сортировка медицинских карт
  const filteredCards = useMemo(() => {
    let filtered = medicalCards.filter(card => {
      const matchesSearch = card.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.patientPhone.includes(searchQuery) ||
                           card.insuranceNumber.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || card.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.patientName.toLowerCase();
          bValue = b.patientName.toLowerCase();
          break;
        case 'lastVisit':
          aValue = new Date(a.lastVisit).getTime();
          bValue = new Date(b.lastVisit).getTime();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'status':
          const statusOrder = { active: 0, temporary: 1, archived: 2 };
          aValue = statusOrder[a.status];
          bValue = statusOrder[b.status];
          break;
        default:
          aValue = a.patientName.toLowerCase();
          bValue = b.patientName.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, statusFilter, sortBy, sortDirection]);

  // Статистика
  const stats = useMemo(() => {
    return {
      total: medicalCards.length,
      active: medicalCards.filter(card => card.status === 'active').length,
      archived: medicalCards.filter(card => card.status === 'archived').length,
      temporary: medicalCards.filter(card => card.status === 'temporary').length,
      withAppointments: medicalCards.filter(card => card.nextAppointment).length,
      updatedToday: medicalCards.filter(card => 
        new Date(card.updatedAt).toDateString() === new Date().toDateString()
      ).length,
    };
  }, []);

  // Обработчики
  const handleFilterReset = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
    setShowFilters(false);
  }, []);

  const handleCardSelect = useCallback((card: MedicalCard) => {
    setSelectedCard(card);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedCard(null);
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
  const shouldShowFilters = showFilters || isClient;

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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Медицинские карты</h1>
              <p className="text-white/60 text-xs sm:text-sm lg:text-base">
                Управление электронными медицинскими картами пациентов
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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

            {/* Filters Grid */}
            <div className={`${shouldShowFilters ? 'grid' : 'hidden lg:grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1 transition-all duration-300`}>
              {[
                {
                  label: 'Статус карты',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'Все статусы' },
                    { value: 'active', label: 'Активные' },
                    { value: 'archived', label: 'В архиве' },
                    { value: 'temporary', label: 'Временные' }
                  ]
                },
                {
                  label: 'Сортировка',
                  value: sortBy,
                  onChange: setSortBy,
                  options: [
                    { value: 'name', label: 'По имени' },
                    { value: 'lastVisit', label: 'По дате визита' },
                    { value: 'createdAt', label: 'По дате создания' },
                    { value: 'status', label: 'По статусу' }
                  ]
                },
                {
                  label: 'Направление',
                  value: sortDirection,
                  onChange: setSortDirection,
                  options: [
                    { value: 'asc', label: 'Возрастание' },
                    { value: 'desc', label: 'Убывание' }
                  ]
                },
                {
                  label: 'Действия',
                  value: '',
                  onChange: () => {},
                  options: [
                    { value: '', label: 'Быстрые действия', disabled: true },
                    { value: 'export', label: 'Экспорт данных' },
                    { value: 'print', label: 'Печать карт' },
                    { value: 'backup', label: 'Резервная копия' }
                  ]
                }
              ].map((filter, index) => (
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
                    onChange={(e) => filter.onChange(e.target.value)}
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
                {[
                  { value: 'list' as ViewType, label: 'Список', icon: '📋' },
                  { value: 'grid' as ViewType, label: 'Сетка', icon: '⏹️' }
                ].map(({ value, label, icon }) => (
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
                <span className="hidden sm:inline">Новая карта</span>
                <span className="sm:hidden">Новая</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8"
        >
          {[
            { label: 'Всего карт', value: stats.total, icon: '📁', color: 'from-blue-500 to-cyan-500' },
            { label: 'Активные', value: stats.active, icon: '✅', color: 'from-green-500 to-emerald-500' },
            { label: 'В архиве', value: stats.archived, icon: '📂', color: 'from-gray-500 to-gray-600' },
            { label: 'Временные', value: stats.temporary, icon: '⏱️', color: 'from-orange-500 to-orange-600' },
            { label: 'С назначениями', value: stats.withAppointments, icon: '📅', color: 'from-purple-500 to-purple-600' },
            { label: 'Обновлены сегодня', value: stats.updatedToday, icon: '🔄', color: 'from-green-500 to-green-600' }
          ].map((stat, index) => (
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

        {/* Medical Cards List */}
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
                <div className="col-span-4">Пациент</div>
                <div className="col-span-2">Контакты</div>
                <div className="col-span-2">Медицинская информация</div>
                <div className="col-span-2">Статус & Визиты</div>
                <div className="col-span-2">Действия</div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-white/10">
                {filteredCards.map((card, index) => (
                  <MedicalCardRow
                    key={card.id}
                    card={card}
                    index={index}
                    onSelect={handleCardSelect}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredCards.map((card, index) => (
                <MedicalCardGrid
                  key={card.id}
                  card={card}
                  index={index}
                  onSelect={handleCardSelect}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredCards.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl sm:text-3xl mb-4 mx-auto">
                📁
              </div>
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Медицинские карты не найдены</h3>
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

      {/* Medical Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <MedicalCardDetailModal
            card={selectedCard}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Medical Card Row Component
function MedicalCardRow({ card, index, onSelect }: any) {
  const statusConfig = getStatusConfig(card.status);
  const bloodTypeConfig = getBloodTypeConfig(card.bloodType, card.rhFactor);
  const age = calculateAge(card.patientBirthDate);

  const handleClick = useCallback(() => {
    onSelect(card);
  }, [onSelect, card]);

  const handleActionClick = useCallback((e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} clicked for card ${card.id}`);
  }, [card.id]);

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
            <h3 className="font-semibold text-white text-base mb-1 truncate">
              {card.patientName}
            </h3>
            <div className="text-white/60 text-sm flex items-center gap-2 flex-wrap">
              <span>{age} лет</span>
              <span>•</span>
              <span>{card.patientGender === 'male' ? 'Мужской' : 'Женский'}</span>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 ml-2`}>
            {statusConfig.icon}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/60 text-xs mb-1">Контакты</div>
            <div className="text-white font-medium text-sm">
              {card.patientPhone}
            </div>
            <div className="text-white/60 text-xs truncate">
              {card.patientEmail}
            </div>
          </div>
          
          <div>
            <div className="text-white/60 text-xs mb-1">Мед. информация</div>
            <div className="flex items-center gap-1 mb-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${bloodTypeConfig.color}`}>
                {bloodTypeConfig.label}
              </span>
            </div>
            <div className="text-white/60 text-xs">
              {card.insurance}
            </div>
          </div>
        </div>

        {/* Last Visit & Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <div>
            <div className="text-white/60 text-xs mb-1">Последний визит</div>
            <div className="text-white font-medium text-sm">
              {new Date(card.lastVisit).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <button 
            onClick={(e) => handleActionClick(e, 'view')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
            aria-label="Просмотр карты"
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
        {/* Patient Info */}
        <div className="hidden sm:block col-span-4">
          <div className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
            {card.patientName}
          </div>
          <div className="text-white/60 text-sm">
            {age} лет, {card.patientGender === 'male' ? 'Мужской' : 'Женский'}
          </div>
          <div className="text-white/60 text-xs mt-1">
            ID: {card.patientId}
          </div>
        </div>

        {/* Contacts */}
        <div className="hidden sm:block col-span-2">
          <div className="text-white font-medium text-sm">{card.patientPhone}</div>
          <div className="text-white/60 text-sm truncate" title={card.patientEmail}>
            {card.patientEmail}
          </div>
        </div>

        {/* Medical Info */}
        <div className="hidden sm:block col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bloodTypeConfig.color}`}>
              {bloodTypeConfig.label}
            </span>
          </div>
          <div className="text-white/60 text-sm">
            {card.insurance}
          </div>
          <div className="text-white/60 text-xs">
            {card.insuranceNumber}
          </div>
        </div>

        {/* Status & Visits */}
        <div className="hidden sm:block col-span-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} mb-2 inline-block`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
          <div className="text-white/60 text-sm">
            Последний визит: {new Date(card.lastVisit).toLocaleDateString('ru-RU')}
          </div>
          {card.nextAppointment && (
            <div className="text-green-400 text-xs">
              Следующий: {new Date(card.nextAppointment).toLocaleDateString('ru-RU')}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="hidden sm:flex col-span-2 items-center justify-end">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => handleActionClick(e, 'view')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="Просмотр карты"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button 
              onClick={(e) => handleActionClick(e, 'edit')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="Редактировать"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={(e) => handleActionClick(e, 'history')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-white/60 hover:text-white"
              title="История болезни"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </>
    </motion.div>
  );
}

// Medical Card Grid Component
function MedicalCardGrid({ card, index, onSelect }: any) {
  const statusConfig = getStatusConfig(card.status);
  const bloodTypeConfig = getBloodTypeConfig(card.bloodType, card.rhFactor);
  const age = calculateAge(card.patientBirthDate);

  const handleClick = useCallback(() => {
    onSelect(card);
  }, [onSelect, card]);

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
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg group-hover:text-blue-400 transition-colors mb-2 truncate">
            {card.patientName}
          </h3>
          <div className="flex items-center gap-2 text-white/60 text-sm flex-wrap">
            <span>{age} лет</span>
            <span>•</span>
            <span>{card.patientGender === 'male' ? 'Мужской' : 'Женский'}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex-shrink-0 ml-2`}>
          {statusConfig.icon}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="text-white/60">Телефон</div>
          <div className="text-white font-medium">{card.patientPhone}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-white/60">Email</div>
          <div className="text-white truncate max-w-[140px]">{card.patientEmail}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-white/60">Группа крови</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bloodTypeConfig.color}`}>
            {bloodTypeConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-white/60">Страховка</div>
          <div className="text-white">{card.insurance}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-white/60">Лечащий врач</div>
          <div className="text-white text-right truncate max-w-[120px]">
            {card.attendingPhysician}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-white/60 text-xs">Последний визит</div>
            <div className="text-white font-medium">
              {new Date(card.lastVisit).toLocaleDateString('ru-RU')}
            </div>
          </div>
          {card.nextAppointment && (
            <div className="text-right">
              <div className="text-green-400/60 text-xs">Следующий</div>
              <div className="text-green-400 font-medium">
                {new Date(card.nextAppointment).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Medical Card Detail Modal Component
function MedicalCardDetailModal({ card, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'allergies' | 'chronic' | 'labs'>('info');
  
  const statusConfig = getStatusConfig(card.status);
  const bloodTypeConfig = getBloodTypeConfig(card.bloodType, card.rhFactor);
  const age = calculateAge(card.patientBirthDate);
  
  const medicalHistory = getMedicalHistoryByCardId(card.id);
  const allergies = getAllergiesByCardId(card.id);
  const chronicDiseases = getChronicDiseasesByCardId(card.id);
  const labResults = getLabResultsByCardId(card.id);

  const tabs = [
    { id: 'info' as const, label: 'Основная информация', icon: '📋' },
    { id: 'history' as const, label: 'История болезни', icon: '🩺' },
    { id: 'allergies' as const, label: 'Аллергии', icon: '⚠️' },
    { id: 'chronic' as const, label: 'Хронические заболевания', icon: '📊' },
    { id: 'labs' as const, label: 'Лабораторные данные', icon: '🔬' }
  ];

  // Добавляем обработчик закрытия по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
        className="bg-slate-800 border border-white/10 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Медицинская карта пациента</h2>
              <p className="text-white/60 text-sm mt-1">{card.patientName}</p>
            </div>
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
          {/* Tabs */}
          <div className="flex overflow-x-auto mb-6 pb-2 -mx-2 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap mr-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'info' && <BasicInfoTab card={card} age={age} statusConfig={statusConfig} bloodTypeConfig={bloodTypeConfig} />}
            {activeTab === 'history' && <MedicalHistoryTab history={medicalHistory} />}
            {activeTab === 'allergies' && <AllergiesTab allergies={allergies} />}
            {activeTab === 'chronic' && <ChronicDiseasesTab diseases={chronicDiseases} />}
            {activeTab === 'labs' && <LabResultsTab results={labResults} />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Tab Components
function BasicInfoTab({ card, age, statusConfig, bloodTypeConfig }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Персональная информация</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">ФИО:</span>
              <span className="text-white font-medium">{card.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Дата рождения:</span>
              <span className="text-white">{new Date(card.patientBirthDate).toLocaleDateString('ru-RU')} ({age} лет)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Пол:</span>
              <span className="text-white">{card.patientGender === 'male' ? 'Мужской' : 'Женский'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Телефон:</span>
              <span className="text-white">{card.patientPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Email:</span>
              <span className="text-white">{card.patientEmail}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Статус карты</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Статус:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Создана:</span>
              <span className="text-white">{new Date(card.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Обновлена:</span>
              <span className="text-white">{new Date(card.updatedAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Последний визит:</span>
              <span className="text-white">{new Date(card.lastVisit).toLocaleDateString('ru-RU')}</span>
            </div>
            {card.nextAppointment && (
              <div className="flex justify-between">
                <span className="text-white/60">Следующий визит:</span>
                <span className="text-green-400">{new Date(card.nextAppointment).toLocaleDateString('ru-RU')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Медицинская информация</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Группа крови:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${bloodTypeConfig.color}`}>
                {bloodTypeConfig.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Страховка:</span>
              <span className="text-white">{card.insurance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Номер страховки:</span>
              <span className="text-white">{card.insuranceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Лечащий врач:</span>
              <span className="text-white">{card.attendingPhysician}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-white text-sm sm:text-base mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-3 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
              📝 Запись на прием
            </button>
            <button className="px-3 py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm">
              📄 Выписка
            </button>
            <button className="px-3 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm">
              ✏️ Редактировать
            </button>
            <button className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-sm">
              🖨️ Печать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicalHistoryTab({ history }: any) {
  return (
    <div className="space-y-4">
      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl mb-3 mx-auto">
            🩺
          </div>
          <h3 className="text-white font-semibold text-base mb-1">История болезни пуста</h3>
          <p className="text-white/60 text-sm">Записи в истории болезни отсутствуют</p>
        </div>
      ) : (
        history.map((record: any) => (
          <div key={record.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white text-sm sm:text-base">{record.title}</h4>
                <p className="text-white/60 text-xs sm:text-sm">{record.doctor} • {record.department}</p>
              </div>
              <span className="text-white/60 text-xs sm:text-sm">
                {new Date(record.date).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <p className="text-white/80 text-sm mb-3">{record.description}</p>
            {record.medications && record.medications.length > 0 && (
              <div className="mt-3">
                <div className="text-white/60 text-xs mb-2">Назначенные препараты:</div>
                <div className="space-y-2">
                  {record.medications.map((med: any) => (
                    <div key={med.id} className="flex items-center justify-between text-xs bg-white/5 rounded-lg p-2">
                      <div>
                        <span className="text-white font-medium">{med.name}</span>
                        <span className="text-white/60 ml-2">{med.dosage}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        med.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                        med.status === 'completed' ? 'bg-gray-500/20 text-gray-400' : 
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {med.status === 'active' ? 'Активно' : med.status === 'completed' ? 'Завершено' : 'Отменено'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function AllergiesTab({ allergies }: any) {
  const getSeverityConfig = (severity: string) => {
    const configs = {
      mild: { color: 'bg-green-500/20 text-green-400', label: 'Легкая' },
      moderate: { color: 'bg-orange-500/20 text-orange-400', label: 'Средняя' },
      severe: { color: 'bg-red-500/20 text-red-400', label: 'Тяжелая' }
    };
    return configs[severity as keyof typeof configs] || configs.mild;
  };

  return (
    <div className="space-y-4">
      {allergies.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl mb-3 mx-auto">
            ⚠️
          </div>
          <h3 className="text-white font-semibold text-base mb-1">Аллергии не зарегистрированы</h3>
          <p className="text-white/60 text-sm">У пациента нет записей об аллергиях</p>
        </div>
      ) : (
        allergies.map((allergy: any) => {
          const severityConfig = getSeverityConfig(allergy.severity);
          return (
            <div key={allergy.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">{allergy.allergen}</h4>
                  <p className="text-white/60 text-xs sm:text-sm">Реакция: {allergy.reaction}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityConfig.color}`}>
                  {severityConfig.label}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-white/60">
                <span>Впервые выявлена: {new Date(allergy.firstObserved).toLocaleDateString('ru-RU')}</span>
                <span className={allergy.status === 'active' ? 'text-red-400' : 'text-green-400'}>
                  {allergy.status === 'active' ? 'Активна' : 'Разрешена'}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ChronicDiseasesTab({ diseases }: any) {
  const getStatusConfig = (status: string) => {
    const configs = {
      active: { color: 'bg-red-500/20 text-red-400', label: 'Активно', icon: '🔴' },
      'in-remission': { color: 'bg-orange-500/20 text-orange-400', label: 'Ремиссия', icon: '🟡' },
      resolved: { color: 'bg-green-500/20 text-green-400', label: 'Разрешено', icon: '🟢' }
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  return (
    <div className="space-y-4">
      {diseases.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl mb-3 mx-auto">
            📊
          </div>
          <h3 className="text-white font-semibold text-base mb-1">Хронические заболевания не зарегистрированы</h3>
          <p className="text-white/60 text-sm">У пациента нет записей о хронических заболеваниях</p>
        </div>
      ) : (
        diseases.map((disease: any) => {
          const statusConfig = getStatusConfig(disease.status);
          return (
            <div key={disease.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-sm sm:text-base mb-2">{disease.disease}</h4>
                  <p className="text-white/80 text-sm mb-2">{disease.treatment}</p>
                  {disease.notes && (
                    <p className="text-white/60 text-xs">{disease.notes}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} flex-shrink-0 ml-3`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-white/60">
                Диагностировано: {new Date(disease.diagnosedDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function LabResultsTab({ results }: any) {
  return (
    <div className="space-y-4">
      {results.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-xl mb-3 mx-auto">
            🔬
          </div>
          <h3 className="text-white font-semibold text-base mb-1">Лабораторные данные отсутствуют</h3>
          <p className="text-white/60 text-sm">Нет доступных результатов лабораторных исследований</p>
        </div>
      ) : (
        results.map((result: any) => (
          <div key={result.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white text-sm sm:text-base">{result.testName}</h4>
                <p className="text-white/60 text-xs sm:text-sm">
                  {new Date(result.testDate).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                result.status === 'normal' ? 'bg-green-500/20 text-green-400' :
                result.status === 'abnormal' ? 'bg-orange-500/20 text-orange-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {result.status === 'normal' ? 'Норма' : 
                 result.status === 'abnormal' ? 'Отклонение' : 'Критично'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-white/60 text-xs">Результат</div>
                <div className="text-white font-medium">{result.result} {result.unit}</div>
              </div>
              <div>
                <div className="text-white/60 text-xs">Референсные значения</div>
                <div className="text-white">{result.normalRange}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-white/60 text-xs">Интерпретация</div>
                <div className="text-white">
                  {result.status === 'normal' ? 'В пределах нормы' :
                   result.status === 'abnormal' ? 'Незначительное отклонение' :
                   'Требуется срочное внимание'}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}