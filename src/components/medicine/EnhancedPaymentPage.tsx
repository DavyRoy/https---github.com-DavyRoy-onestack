// components/EnhancedPaymentPage.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import { invoices as initialInvoices, paymentMethods } from '@/app/demo/medicine/user/modules/payment/demo-data';
import PaymentMethodManager from './PaymentMethodManager';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import PaymentModal from './PaymentModal';

export default function EnhancedPaymentPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue' | 'partially_paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || invoice.status === filter;
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Статистика
  const stats = {
    total: invoices.length,
    pending: invoices.filter(i => i.status === 'pending').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalPending: invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    totalOverdue: invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
    totalPaid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
  };

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  const handlePaymentSuccess = (invoiceId: string, paymentData: any) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...inv, 
            status: 'paid',
            paidDate: new Date().toISOString().split('T')[0],
            paymentMethod: paymentData.method,
            paidAmount: inv.amount
          }
        : inv
    ));
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  const handlePartialPayment = (invoiceId: string, amount: number, paymentData: any) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const paidAmount = (inv.paidAmount || 0) + amount;
        const remainingAmount = inv.amount - paidAmount;
        return {
          ...inv,
          status: remainingAmount > 0 ? 'partially_paid' : 'paid',
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: paymentData.method,
          paidAmount: paidAmount,
          remainingAmount: remainingAmount
        };
      }
      return inv;
    }));
    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'overdue': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'partially_paid': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'cancelled': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Оплачен';
      case 'pending': return 'Ожидает оплаты';
      case 'overdue': return 'Просрочен';
      case 'partially_paid': return 'Частично оплачен';
      case 'cancelled': return 'Отменён';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <DemoBreadcrumbs 
          items={[
            { label: 'Демо', href: '/demo' },
            { label: 'Медицина', href: '/demo/medicine' },
            { label: 'Пациент', href: '/demo/medicine/user' },
            { label: 'Оплата и счета', href: '#' }
          ]} 
        />
        
        <div className="flex items-center justify-between mt-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Управление счетами</h1>
            <p className="text-white/60">Онлайн-оплата медицинских услуг и управление платежами</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowPaymentMethods(true)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium"
            >
              💳 Управление оплатой
            </button>
            <Link
              href="/demo/medicine/user"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium"
            >
              ← Назад к дашборду
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Всего счетов</span>
                <span className="text-2xl">📄</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Ожидает оплаты</span>
                <span className="text-2xl">⏳</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">{stats.totalPending.toLocaleString()} ₽</div>
              <div className="text-white/60 text-sm mt-1">{stats.pending} счетов</div>
            </div>
            
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Просрочено</span>
                <span className="text-2xl">🚨</span>
              </div>
              <div className="text-2xl font-bold text-red-400">{stats.totalOverdue.toLocaleString()} ₽</div>
              <div className="text-white/60 text-sm mt-1">{stats.overdue} счетов</div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Оплачено</span>
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{stats.totalPaid.toLocaleString()} ₽</div>
              <div className="text-white/60 text-sm mt-1">{stats.paid} счетов</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по номеру счета или имени пациента..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40"
              />
            </div>
            
            <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1">
              {[
                { value: 'all', label: 'Все', count: stats.total },
                { value: 'pending', label: 'Ожидают', count: stats.pending },
                { value: 'paid', label: 'Оплачены', count: stats.paid },
                { value: 'overdue', label: 'Просрочены', count: stats.overdue },
                { value: 'partially_paid', label: 'Частично', count: invoices.filter(i => i.status === 'partially_paid').length }
              ].map(({ value, label, count }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    filter === value
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    filter === value ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Invoices List */}
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onPay={() => handlePayInvoice(invoice)}
                onViewDetails={() => handleViewDetails(invoice)}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))}

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-4 mx-auto">
                  💳
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Счетов не найдено</h3>
                <p className="text-white/60">Попробуйте изменить параметры поиска или фильтрации</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setShowPaymentMethods(true)}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3"
              >
                <span className="text-xl">💳</span>
                <span>Управление способами оплаты</span>
              </button>
              <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3">
                <span className="text-xl">📊</span>
                <span>Отчет по платежам</span>
              </button>
              <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3">
                <span className="text-xl">🔄</span>
                <span>Автоплатежи</span>
              </button>
            </div>
          </div>

          {/* Payment History */}
          <PaymentHistory />
          
          {/* Support */}
          <SupportSection />
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onPartialPayment={handlePartialPayment}
        />
      )}

      {showInvoiceDetails && selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setShowInvoiceDetails(false)}
          onPay={() => {
            setShowInvoiceDetails(false);
            handlePayInvoice(selectedInvoice);
          }}
        />
      )}

      {showPaymentMethods && (
        <PaymentMethodManager
          onClose={() => setShowPaymentMethods(false)}
        />
      )}
    </div>
  );
}

// Компонент карточки счета
const InvoiceCard = ({ invoice, onPay, onViewDetails, getStatusColor, getStatusText }: any) => (
  <div className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 group">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-white text-lg">{invoice.number}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
              {getStatusText(invoice.status)}
            </span>
          </div>
          <p className="text-white/60 text-sm">
            {new Date(invoice.date).toLocaleDateString('ru-RU')} • 
            До {new Date(invoice.dueDate).toLocaleDateString('ru-RU')}
          </p>
          {invoice.patientName && (
            <p className="text-white/80 text-sm mt-1">{invoice.patientName}</p>
          )}
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold text-white mb-1">
            {invoice.amount.toLocaleString()} ₽
          </div>
          {invoice.paidAmount && invoice.remainingAmount && (
            <div className="text-sm text-white/60">
              Оплачено: {invoice.paidAmount.toLocaleString()} ₽
            </div>
          )}
        </div>
      </div>

      {/* Progress bar for partially paid invoices */}
      {invoice.status === 'partially_paid' && invoice.paidAmount && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-white/60 mb-1">
            <span>Прогресс оплаты</span>
            <span>{Math.round((invoice.paidAmount / invoice.amount) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(invoice.paidAmount / invoice.amount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Services Preview */}
      <div className="mb-4">
        <div className="text-sm text-white/60 mb-2">
          Услуги ({invoice.services.length}):
        </div>
        <div className="space-y-1">
          {invoice.services.slice(0, 2).map((service: ServiceDetail) => (
            <div key={service.id} className="flex justify-between items-center text-sm">
              <span className="text-white/80 truncate">
                {service.name}
                {service.quantity > 1 && ` × ${service.quantity}`}
              </span>
              <span className="text-white flex-shrink-0 ml-2">
                {service.total.toLocaleString()} ₽
              </span>
            </div>
          ))}
          {invoice.services.length > 2 && (
            <div className="text-white/60 text-sm">
              + еще {invoice.services.length - 2} услуг
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onViewDetails}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Подробнее →
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={onViewDetails}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium"
          >
            📄 PDF
          </button>
          {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'partially_paid') ? (
            <button
              onClick={onPay}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium text-white"
            >
              {invoice.status === 'partially_paid' ? 'Доплатить' : 'Оплатить'}
            </button>
          ) : (
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-medium" disabled>
              Оплачен
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Компоненты для sidebar (упрощенные версии)
const PaymentHistory = () => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
    <h3 className="font-semibold text-white mb-4">Последние платежи</h3>
    <div className="space-y-3">
      {/* Здесь будет динамическая история платежей */}
    </div>
  </div>
);

const SupportSection = () => (
  <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
    <h3 className="font-semibold text-white mb-4">Помощь с оплатой</h3>
    <div className="space-y-3 text-sm">
      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3">
        <span>📞</span>
        <span>Контакты бухгалтерии</span>
      </button>
      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3">
        <span>❓</span>
        <span>Частые вопросы</span>
      </button>
      <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3">
        <span>📋</span>
        <span>Реквизиты клиники</span>
      </button>
    </div>
  </div>
);