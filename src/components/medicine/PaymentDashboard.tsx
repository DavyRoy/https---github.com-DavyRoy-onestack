// components/PaymentDashboard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Invoice, Transaction, PaymentSchedule } from '@/app/demo/medicine/user/modules/payment/types/medical-payment';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

interface PaymentDashboardProps {
  stats: any;
  invoices: Invoice[];
  transactions: Transaction[];
  paymentSchedules: PaymentSchedule[];
  onPayInvoice: (invoiceId: string, paymentData: any) => void;
  onCreatePaymentSchedule: (invoiceId: string, installments: number) => void;
}

export default function PaymentDashboard({
  stats,
  invoices,
  transactions,
  paymentSchedules,
  onPayInvoice,
  onCreatePaymentSchedule
}: PaymentDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Chart data for revenue
  const revenueChartData = useMemo(() => {
    const labels = generateTimeLabels(timeRange);
    const data = labels.map(() => Math.floor(Math.random() * 100000) + 50000); // Mock data
    
    return {
      labels,
      datasets: [
        {
          label: 'Доход',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }, [timeRange]);

  // Chart data for payment methods
  const paymentMethodsData = useMemo(() => {
    const methods = {
      'Карта': 45,
      'Страховка': 30,
      'Электронные': 15,
      'Банковский перевод': 10
    };

    return {
      labels: Object.keys(methods),
      datasets: [
        {
          data: Object.values(methods),
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(139, 92, 246)'
          ],
          borderWidth: 2,
          borderColor: 'rgb(30, 41, 59)'
        }
      ]
    };
  }, []);

  const upcomingPayments = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-blue-400 text-sm font-medium">Общий доход</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {stats.totalRevenue.toLocaleString()} ₽
          </div>
          <div className="text-blue-400 text-sm">+12% за месяц</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-orange-400 text-sm font-medium">Ожидает оплаты</span>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {stats.pendingAmount.toLocaleString()} ₽
          </div>
          <div className="text-orange-400 text-sm">{stats.pendingInvoices} счетов</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-400 text-sm font-medium">Успешные платежи</span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {stats.paymentSuccessRate}%
          </div>
          <div className="text-green-400 text-sm">Среднее время: {stats.averagePaymentTime}д</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-400 text-sm font-medium">Активные рассрочки</span>
            <span className="text-2xl">📅</span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {paymentSchedules.length}
          </div>
          <div className="text-purple-400 text-sm">{stats.overdueInvoices} просрочено</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Динамика доходов</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
            >
              <option value="7d">7 дней</option>
              <option value="30d">30 дней</option>
              <option value="90d">90 дней</option>
              <option value="1y">1 год</option>
            </select>
          </div>
          <div className="h-64">
            <Line 
              data={revenueChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  },
                  y: {
                    grid: {
                      color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                      color: 'rgba(255,255,255,0.6)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Способы оплаты</h3>
          <div className="h-64">
            <Doughnut 
              data={paymentMethodsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgba(255,255,255,0.8)',
                      padding: 20
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Ближайшие платежи</h3>
          <div className="space-y-3">
            {upcomingPayments.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <div className="text-white font-medium text-sm">{invoice.number}</div>
                  <div className="text-white/60 text-xs">
                    До {new Date(invoice.dueDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{invoice.remainingAmount.toLocaleString()} ₽</div>
                  <button 
                    onClick={() => onPayInvoice(invoice.id, { method: 'card', amount: invoice.remainingAmount })}
                    className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                  >
                    Оплатить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Последние транзакции</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    transaction.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {transaction.status === 'completed' ? '✅' : '⏳'}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-white/60 text-xs">
                      {new Date(transaction.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{transaction.amount.toLocaleString()} ₽</div>
                  <div className="text-white/60 text-xs capitalize">{transaction.paymentMethod}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors text-blue-400 text-left">
            <div className="text-2xl mb-2">💳</div>
            <div className="font-medium">Добавить карту</div>
            <div className="text-sm opacity-80">Настройте способ оплаты</div>
          </button>
          
          <button className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors text-green-400 text-left">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium">Скачать отчет</div>
            <div className="text-sm opacity-80">Финансовая аналитика</div>
          </button>
          
          <button className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors text-purple-400 text-left">
            <div className="text-2xl mb-2">🛟</div>
            <div className="font-medium">Поддержка</div>
            <div className="text-sm opacity-80">Помощь с оплатой</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function generateTimeLabels(range: string): string[] {
  const now = new Date();
  const labels: string[] = [];
  
  switch (range) {
    case '7d':
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        labels.push(date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
      }
      break;
    case '30d':
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        if (i % 5 === 0) {
          labels.push(date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }));
        } else {
          labels.push('');
        }
      }
      break;
    // Add other cases for 90d and 1y
  }
  
  return labels;
}