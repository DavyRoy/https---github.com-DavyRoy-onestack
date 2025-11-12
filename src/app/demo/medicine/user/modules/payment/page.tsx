'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { invoices, paymentMethods, paymentHistory, Invoice, PaymentMethod } from './demo-data';
import { InteractiveCard } from '@/components/medicine/InteractiveCard';
import PaymentModal from '@/components/medicine/PaymentModal';
import InvoiceDetailsModal from '@/components/medicine/InvoiceDetailsModal';
import PaymentMethodsManager from '@/components/medicine/PaymentMethodManager';

// Форматирование чисел без использования locale для избежания ошибок гидрации
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Форматирование даты с фиксированной локалью
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

export default function PaymentPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [showPaymentMethodsManager, setShowPaymentMethodsManager] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');
  const [isClient, setIsClient] = useState(false);

  // Исправление для гидрации - рендерим только на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesFilter = filter === 'all' || invoice.status === filter;
      const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.services.some(service => 
                           service.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  const sortedInvoices = useMemo(() => 
    [...filteredInvoices].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ), [filteredInvoices]
  );

  const stats = useMemo(() => ({
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'pending').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    totalPending: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    totalOverdue: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
    totalPaid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  }), []);

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    console.log('Processing payment:', paymentData);
    // Имитация обработки платежа
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // В реальном приложении здесь был бы вызов API
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  const handleUpdatePaymentMethods = (updatedMethods: PaymentMethod[]) => {
    setMethods(updatedMethods);
    setShowPaymentMethodsManager(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'cancelled': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Оплачен';
      case 'pending': return 'Ожидает оплаты';
      case 'overdue': return 'Просрочен';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return '✅';
      case 'pending': return '⏳';
      case 'overdue': return '🚨';
      case 'cancelled': return '❌';
      default: return '📄';
    }
  };

  // Не рендерим контент до гидрации
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/demo/medicine/user"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
                >
                  <span className="text-lg">←</span>
                  <span>Назад к дашборду</span>
                </Link>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Оплата и счета</h1>
              <p className="text-white/60 text-sm lg:text-base">
                Управление счетами и онлайн-оплата медицинских услуг
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            <InteractiveCard className="p-3 lg:p-4 text-center">
              <div className="text-lg lg:text-2xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-white/60 text-xs lg:text-sm">Всего счетов</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-yellow-500/10 border-yellow-500/20">
              <div className="text-lg lg:text-2xl font-bold text-yellow-400 mb-1">{formatNumber(stats.totalPending)} ₽</div>
              <div className="text-yellow-400/60 text-xs lg:text-sm">Ожидает оплаты</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-red-500/10 border-red-500/20">
              <div className="text-lg lg:text-2xl font-bold text-red-400 mb-1">{formatNumber(stats.totalOverdue)} ₽</div>
              <div className="text-red-400/60 text-xs lg:text-sm">Просрочено</div>
            </InteractiveCard>
            <InteractiveCard className="p-3 lg:p-4 text-center bg-green-500/10 border-green-500/20">
              <div className="text-lg lg:text-2xl font-bold text-green-400 mb-1">{formatNumber(stats.totalPaid)} ₽</div>
              <div className="text-green-400/60 text-xs lg:text-sm">Оплачено</div>
            </InteractiveCard>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* View Toggle */}
              <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
                {[
                  { value: 'list', label: '📋 Список', icon: '📋' },
                  { value: 'grid', label: '📊 Сетка', icon: '📊' }
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setActiveView(value as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeView === value
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span>{icon}</span>
                    <span className="hidden xs:block">{label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'Все', count: stats.total },
                  { value: 'pending', label: 'Ожидают', count: stats.pending },
                  { value: 'paid', label: 'Оплачены', count: stats.paid },
                  { value: 'overdue', label: 'Просрочены', count: stats.overdue }
                ].map(({ value, label, count }) => (
                  <motion.button
                    key={value}
                    onClick={() => setFilter(value as any)}
                    className={`px-3 py-2 rounded-2xl text-sm font-medium border transition-all duration-200 ${
                      filter === value
                        ? value === 'all' 
                          ? 'bg-white/20 text-white border-white/30'
                          : getStatusColor(value)
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {label} {count > 0 && `(${count})`}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeView === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 lg:space-y-6"
                >
                  {sortedInvoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <InteractiveCard 
                        className="p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        <div className="flex items-start gap-3 lg:gap-4">
                          {/* Status Icon */}
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-base lg:text-lg border flex-shrink-0 ${
                            invoice.status === 'paid' ? 'bg-green-500/20 border-green-500/30' :
                            invoice.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/30' :
                            invoice.status === 'overdue' ? 'bg-red-500/20 border-red-500/30' :
                            'bg-gray-500/20 border-gray-500/30'
                          }`}>
                            {getStatusIcon(invoice.status)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-3 lg:mb-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-base lg:text-lg mb-1 line-clamp-1">
                                  {invoice.number}
                                </h3>
                                <p className="text-white/60 text-sm">
                                  {invoice.patientName}
                                </p>
                              </div>
                              
                              <div className="flex flex-col xs:flex-row gap-2">
                                <span className={`px-2 lg:px-3 py-1 rounded-lg text-xs border ${getStatusColor(invoice.status)} whitespace-nowrap`}>
                                  {getStatusText(invoice.status)}
                                </span>
                                <div className="text-lg lg:text-2xl font-bold text-white whitespace-nowrap">
                                  {formatNumber(invoice.amount)} ₽
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
                              <div>
                                <div className="text-xs lg:text-sm text-white/60 mb-1">Дата выставления</div>
                                <div className="text-white font-medium text-sm lg:text-base">
                                  {formatDateShort(invoice.date)}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs lg:text-sm text-white/60 mb-1">Срок оплаты</div>
                                <div className="text-white font-medium text-sm lg:text-base">
                                  {formatDateShort(invoice.dueDate)}
                                </div>
                              </div>
                            </div>

                            {/* Services Preview */}
                            <div className="mb-3 lg:mb-4">
                              <div className="text-xs lg:text-sm text-white/60 mb-2">Услуги:</div>
                              <div className="space-y-1">
                                {invoice.services.slice(0, 2).map((service) => (
                                  <div key={service.id} className="flex justify-between items-center text-xs lg:text-sm">
                                    <span className="text-white/80 line-clamp-1">
                                      {service.name}
                                      {service.quantity > 1 && ` × ${service.quantity}`}
                                    </span>
                                    <span className="text-white whitespace-nowrap ml-2">
                                      {formatNumber(service.total)} ₽
                                    </span>
                                  </div>
                                ))}
                                {invoice.services.length > 2 && (
                                  <div className="text-white/60 text-xs">
                                    +{invoice.services.length - 2} других услуг
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 lg:pt-4 border-t border-white/10">
                              <div className="text-xs lg:text-sm text-white/60">
                                {invoice.paymentMethod && `Оплачено: ${formatDateShort(invoice.paidDate!)}`}
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(invoice);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-xs lg:text-sm font-medium text-white/60 hover:text-white"
                                >
                                  Подробнее
                                </button>
                                {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePayInvoice(invoice);
                                    }}
                                    className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-xs lg:text-sm font-medium text-white"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Оплатить
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </InteractiveCard>
                    </motion.div>
                  ))}

                  {sortedInvoices.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <InteractiveCard className="p-8 lg:p-12 text-center">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl lg:text-3xl mb-4 lg:mb-6 mx-auto">
                          💳
                        </div>
                        <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 lg:mb-3">Счетов не найдено</h3>
                        <p className="text-white/60 text-sm lg:text-base mb-6 lg:mb-8">
                          Попробуйте изменить параметры поиска или фильтрации
                        </p>
                        <motion.button
                          onClick={() => {
                            setFilter('all');
                            setSearchTerm('');
                          }}
                          className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-blue-400 text-sm lg:text-base font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>🔄</span>
                          <span>Сбросить фильтры</span>
                        </motion.button>
                      </InteractiveCard>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
                >
                  {sortedInvoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <InteractiveCard 
                        className="p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group h-full"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        <div className="flex items-center gap-3 mb-3 lg:mb-4">
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-base lg:text-lg border ${
                            invoice.status === 'paid' ? 'bg-green-500/20 border-green-500/30' :
                            invoice.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/30' :
                            invoice.status === 'overdue' ? 'bg-red-500/20 border-red-500/30' :
                            'bg-gray-500/20 border-gray-500/30'
                          }`}>
                            {getStatusIcon(invoice.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm lg:text-base line-clamp-1">
                              {invoice.number}
                            </h3>
                            <p className="text-white/60 text-xs lg:text-sm line-clamp-1">
                              {formatDateShort(invoice.date)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 lg:space-y-3">
                          <div>
                            <div className="text-xs text-white/60 mb-1">Сумма</div>
                            <div className="text-white font-bold text-lg lg:text-xl">
                              {formatNumber(invoice.amount)} ₽
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-white/60 mb-1">Срок оплаты</div>
                            <div className="text-white/80 text-sm">
                              {formatDateShort(invoice.dueDate)}
                            </div>
                          </div>

                          <div className="flex flex-col xs:flex-row gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(invoice.status)} whitespace-nowrap`}>
                              {getStatusText(invoice.status)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-white/60">
                            <div className="flex items-center gap-2 lg:gap-3">
                              <span>📋 {invoice.services.length} услуг</span>
                            </div>
                            <motion.span
                              className="group-hover:text-white transition-colors"
                              whileHover={{ x: 3 }}
                            >
                              →
                            </motion.span>
                          </div>
                        </div>

                        {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayInvoice(invoice);
                            }}
                            className="w-full mt-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium text-white"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Оплатить
                          </motion.button>
                        )}
                      </InteractiveCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Payment Methods */}
            <InteractiveCard className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="font-semibold text-white text-sm lg:text-base">💳 Способы оплаты</h3>
                <motion.button
                  onClick={() => setShowPaymentMethodsManager(true)}
                  className="text-blue-400 hover:text-blue-300 text-xs lg:text-sm font-medium"
                  whileHover={{ x: 2 }}
                >
                  Управлять
                </motion.button>
              </div>
              <div className="space-y-2 lg:space-y-3">
                {methods.filter(method => method.isActive).slice(0, 3).map((method) => (
                  <motion.div 
                    key={method.id} 
                    className="p-2 lg:p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="text-lg lg:text-xl">{method.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-xs lg:text-sm line-clamp-1">
                          {method.name}
                        </div>
                        <div className="text-white/60 text-xs line-clamp-1">
                          {method.description}
                        </div>
                      </div>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ x: 2 }}
                      >
                        →
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
                {methods.filter(method => method.isActive).length > 3 && (
                  <div className="text-center text-white/60 text-xs lg:text-sm py-2">
                    +{methods.filter(method => method.isActive).length - 3} других способов
                  </div>
                )}
              </div>
            </InteractiveCard>

            {/* Payment History */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">📊 История платежей</h3>
              <div className="space-y-2 lg:space-y-3">
                {paymentHistory.slice(0, 5).map((payment) => (
                  <motion.div 
                    key={payment.id} 
                    className="p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-white font-medium text-xs lg:text-sm line-clamp-1">
                        {payment.invoiceNumber}
                      </div>
                      <div className="text-green-400 font-semibold text-xs lg:text-sm whitespace-nowrap ml-2">
                        {formatNumber(payment.amount)} ₽
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>{formatDateShort(payment.date)}</span>
                      <span className="capitalize">
                        {payment.method === 'card' && '💳 Карта'}
                        {payment.method === 'bank_transfer' && '🏦 Перевод'}
                        {payment.method === 'electronic' && '📱 Электронные'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {paymentHistory.length > 5 && (
                <motion.button 
                  className="w-full mt-2 lg:mt-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white text-xs lg:text-sm"
                  whileHover={{ x: 4 }}
                >
                  Вся история →
                </motion.button>
              )}
            </InteractiveCard>

            {/* Quick Actions */}
            <InteractiveCard className="p-4 lg:p-6">
              <h3 className="font-semibold text-white text-sm lg:text-base mb-3 lg:mb-4">⚡ Быстрые действия</h3>
              <div className="space-y-2">
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">🧾</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Выставить счет</div>
                    <div className="text-white/60 text-xs">Новый счет на услуги</div>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">📄</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Шаблоны счетов</div>
                    <div className="text-white/60 text-xs">Быстрое создание</div>
                  </div>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center gap-2 lg:gap-3 p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-base lg:text-lg">📊</span>
                  <div>
                    <div className="font-medium text-white text-xs lg:text-sm">Финансовый отчет</div>
                    <div className="text-white/60 text-xs">Анализ платежей</div>
                  </div>
                </motion.button>
              </div>
            </InteractiveCard>

            {/* Support */}
            <InteractiveCard className="p-4 lg:p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-base lg:text-lg">
                  💬
                </div>
                <div>
                  <div className="font-bold text-white text-sm lg:text-base">Поддержка</div>
                  <div className="text-white/60 text-xs lg:text-sm">Помощь с оплатой</div>
                </div>
              </div>
              <div className="space-y-2">
                <motion.button 
                  className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-medium text-xs lg:text-sm">Бухгалтерия</span>
                  <span className="text-white/60 text-xs lg:text-sm">+7 (495) 123-45-67</span>
                </motion.button>
                <motion.button 
                  className="w-full flex items-center justify-between p-2 lg:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-medium text-xs lg:text-sm">Техподдержка</span>
                  <span className="text-white/60 text-xs lg:text-sm">support@clinic.ru</span>
                </motion.button>
              </div>
            </InteractiveCard>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedInvoice && (
          <PaymentModal
            invoice={selectedInvoice}
            paymentMethods={methods}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedInvoice(null);
            }}
            onSubmit={handlePaymentSubmit}
          />
        )}

        {/* Invoice Details Modal */}
        {showInvoiceDetails && selectedInvoice && (
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            onClose={() => {
              setShowInvoiceDetails(false);
              setSelectedInvoice(null);
            }}
            onPay={() => {
              setShowInvoiceDetails(false);
              setShowPaymentModal(true);
            }}
          />
        )}

        {/* Payment Methods Manager */}
        {showPaymentMethodsManager && (
          <PaymentMethodsManager
            paymentMethods={methods}
            onClose={() => setShowPaymentMethodsManager(false)}
            onUpdate={handleUpdatePaymentMethods}
          />
        )}
      </div>
    </div>
  );
}