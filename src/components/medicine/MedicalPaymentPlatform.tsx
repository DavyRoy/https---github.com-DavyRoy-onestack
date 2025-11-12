// components/MedicalPaymentPlatform.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Invoice, 
  PaymentMethod, 
  Transaction, 
  PaymentSchedule,
  MedicalService 
} from '@/types/medical-payment';
import { 
  mockInvoices, 
  mockPaymentMethods, 
  mockTransactions, 
  mockPaymentSchedules,
  mockMedicalServices 
} from './mock-data';
import PaymentDashboard from './PaymentDashboard';
import InvoiceManager from './InvoiceManager';
import PaymentMethodManager from './PaymentMethodManager';
import TransactionHistory from './TransactionHistory';
import PaymentScheduleManager from './PaymentScheduleManager';
import AnalyticsDashboard from './AnalyticsDashboard';
import SupportCenter from './SupportCenter';

type TabType = 'dashboard' | 'invoices' | 'payment-methods' | 'transactions' | 'payment-plans' | 'analytics' | 'support';

export default function MedicalPaymentPlatform() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>(mockPaymentSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [globalFilter, setGlobalFilter] = useState({
    status: 'all',
    dateRange: 'all',
    amountRange: 'all'
  });

  // Real-time statistics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return {
      totalInvoices: invoices.length,
      pendingInvoices: invoices.filter(i => i.status === 'pending').length,
      overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
      totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0),
      pendingAmount: invoices.filter(i => i.status === 'pending' || i.status === 'overdue')
        .reduce((sum, i) => sum + i.remainingAmount, 0),
      monthlyRevenue: invoices
        .filter(i => i.status === 'paid' && 
          new Date(i.paidDate!).getMonth() === currentMonth &&
          new Date(i.paidDate!).getFullYear() === currentYear
        )
        .reduce((sum, i) => sum + i.totalAmount, 0),
      averagePaymentTime: calculateAveragePaymentTime(invoices),
      paymentSuccessRate: calculatePaymentSuccessRate(transactions)
    };
  }, [invoices, transactions]);

  // Real-time notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      message: '3 счета скоро будут просрочены',
      count: 3,
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'info',
      message: 'Новое предложение по рассрочке',
      count: 1,
      timestamp: new Date()
    }
  ]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch updated data from the server
      console.log('Auto-refreshing payment data...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // WebSocket for real-time updates (conceptual)
  useEffect(() => {
    // This would be a WebSocket connection in a real app
    const handlePaymentUpdate = (data: any) => {
      if (data.type === 'payment_completed') {
        setInvoices(prev => prev.map(inv => 
          inv.id === data.invoiceId 
            ? { ...inv, status: 'paid', paidDate: new Date().toISOString() }
            : inv
        ));
        
        setNotifications(prev => [{
          id: Date.now(),
          type: 'success',
          message: `Счет ${data.invoiceNumber} успешно оплачен`,
          count: 1,
          timestamp: new Date()
        }, ...prev]);
      }
    };

    // Simulate real-time update
    const simulateRealTimeUpdate = setTimeout(() => {
      handlePaymentUpdate({
        type: 'payment_completed',
        invoiceId: 'inv-002',
        invoiceNumber: 'INV-2024-002'
      });
    }, 10000);

    return () => clearTimeout(simulateRealTimeUpdate);
  }, []);

  const handlePaymentSuccess = (invoiceId: string, paymentData: any) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...inv, 
            status: 'paid',
            paidDate: new Date().toISOString(),
            paymentMethod: paymentData.method,
            paidAmount: inv.totalAmount,
            remainingAmount: 0
          }
        : inv
    ));

    // Add transaction
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      invoiceId,
      amount: paymentData.amount,
      currency: 'RUB',
      type: 'payment',
      status: 'completed',
      paymentMethod: paymentData.method,
      paymentMethodType: paymentData.methodType,
      processor: paymentData.processor,
      processorTransactionId: paymentData.transactionId,
      description: `Оплата счета ${invoices.find(i => i.id === invoiceId)?.number}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handlePartialPayment = (invoiceId: string, amount: number, paymentData: any) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const paidAmount = (inv.paidAmount || 0) + amount;
        const remainingAmount = inv.totalAmount - paidAmount;
        
        return {
          ...inv,
          status: remainingAmount > 0 ? 'partially_paid' : 'paid',
          paidDate: new Date().toISOString(),
          paymentMethod: paymentData.method,
          paidAmount,
          remainingAmount
        };
      }
      return inv;
    }));
  };

  const handleCreatePaymentSchedule = (invoiceId: string, installments: number) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    const installmentAmount = Math.ceil(invoice.totalAmount / installments);
    const schedule: PaymentSchedule = {
      id: `schedule-${Date.now()}`,
      invoiceId,
      patientId: invoice.patient.id,
      totalAmount: invoice.totalAmount,
      paidAmount: 0,
      installments: Array.from({ length: installments }, (_, i) => ({
        id: `installment-${i}`,
        amount: i === installments - 1 
          ? invoice.totalAmount - (installmentAmount * (installments - 1))
          : installmentAmount,
        dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending'
      })),
      status: 'active',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    setPaymentSchedules(prev => [...prev, schedule]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold">
                  М
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Медицинская Платформа</h1>
                  <p className="text-white/60 text-sm">Управление платежами и счетами</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                {[
                  { id: 'dashboard', label: 'Дашборд', icon: '📊' },
                  { id: 'invoices', label: 'Счета', icon: '📄' },
                  { id: 'payment-methods', label: 'Оплата', icon: '💳' },
                  { id: 'transactions', label: 'Транзакции', icon: '🔄' },
                  { id: 'payment-plans', label: 'Рассрочка', icon: '📅' },
                  { id: 'analytics', label: 'Аналитика', icon: '📈' },
                  { id: 'support', label: 'Поддержка', icon: '🛟' }
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as TabType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === id
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors relative">
                  <span className="text-xl">🔔</span>
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск счетов, услуг..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 transition-colors text-white placeholder-white/40 text-sm"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">🔍</span>
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white font-medium text-sm">Иван Иванов</div>
                  <div className="text-white/60 text-xs">Пациент</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  ИИ
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b border-white/10 bg-gray-900/80 backdrop-blur-sm sticky top-16 z-30">
        <div className="flex overflow-x-auto px-4 py-2 gap-1">
          {[
            { id: 'dashboard', label: '📊', tooltip: 'Дашборд' },
            { id: 'invoices', label: '📄', tooltip: 'Счета' },
            { id: 'payment-methods', label: '💳', tooltip: 'Оплата' },
            { id: 'transactions', label: '🔄', tooltip: 'Транзакции' },
            { id: 'payment-plans', label: '📅', tooltip: 'Рассрочка' },
            { id: 'analytics', label: '📈', tooltip: 'Аналитика' },
            { id: 'support', label: '🛟', tooltip: 'Поддержка' }
          ].map(({ id, label, tooltip }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`flex-shrink-0 p-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
                activeTab === id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              title={tooltip}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <PaymentDashboard
            stats={stats}
            invoices={invoices}
            transactions={transactions}
            paymentSchedules={paymentSchedules}
            onPayInvoice={handlePaymentSuccess}
            onCreatePaymentSchedule={handleCreatePaymentSchedule}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceManager
            invoices={invoices}
            onPayInvoice={handlePaymentSuccess}
            onPartialPayment={handlePartialPayment}
            searchTerm={searchTerm}
            filter={globalFilter}
          />
        )}

        {activeTab === 'payment-methods' && (
          <PaymentMethodManager
            paymentMethods={paymentMethods}
            onUpdateMethods={setPaymentMethods}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionHistory
            transactions={transactions}
            invoices={invoices}
          />
        )}

        {activeTab === 'payment-plans' && (
          <PaymentScheduleManager
            paymentSchedules={paymentSchedules}
            invoices={invoices}
            onPayInstallment={handlePaymentSuccess}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            invoices={invoices}
            transactions={transactions}
            stats={stats}
          />
        )}

        {activeTab === 'support' && (
          <SupportCenter />
        )}
      </main>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-6 z-50 space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-xl border backdrop-blur-sm transform transition-all duration-300 ${
                notification.type === 'warning' 
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                  : notification.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {notification.type === 'warning' ? '⚠️' : 
                   notification.type === 'success' ? '✅' : 'ℹ️'}
                </span>
                <div>
                  <div className="font-medium text-sm">{notification.message}</div>
                  <div className="text-xs opacity-80">
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper functions
function calculateAveragePaymentTime(invoices: Invoice[]): number {
  const paidInvoices = invoices.filter(i => i.status === 'paid' && i.paidDate);
  if (paidInvoices.length === 0) return 0;

  const totalDays = paidInvoices.reduce((sum, invoice) => {
    const issueDate = new Date(invoice.issueDate);
    const paidDate = new Date(invoice.paidDate!);
    const days = Math.ceil((paidDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return Math.round(totalDays / paidInvoices.length);
}

function calculatePaymentSuccessRate(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  
  const successful = transactions.filter(t => t.status === 'completed').length;
  return Math.round((successful / transactions.length) * 100);
}