'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  ticketNumber: string;
  passenger: string;
  route: string;
  amount: number;
  paymentMethod: 'card' | 'cash' | 'online';
  status: 'completed' | 'refunded' | 'pending';
  date: string;
  agent: string;
}

export default function SalesLedgerPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'refunded' | 'pending'>('all');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-15'
  });

  const transactions: Transaction[] = [
    {
      id: '1',
      ticketNumber: 'TK001234',
      passenger: 'Иванов И.И.',
      route: '101А Москва-СПб',
      amount: 2500,
      paymentMethod: 'card',
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      agent: 'Касса #1'
    },
    {
      id: '2',
      ticketNumber: 'TK001235',
      passenger: 'Петров П.П.',
      route: '202Б Москва-НН',
      amount: 1800,
      paymentMethod: 'cash',
      status: 'completed',
      date: '2024-01-15T11:15:00Z',
      agent: 'Касса #2'
    },
    {
      id: '3',
      ticketNumber: 'TK001236',
      passenger: 'Сидоров С.С.',
      route: '101А Москва-СПб',
      amount: 2500,
      paymentMethod: 'online',
      status: 'completed',
      date: '2024-01-15T12:00:00Z',
      agent: 'Онлайн'
    },
    {
      id: '4',
      ticketNumber: 'TK001237',
      passenger: 'Кузнецов К.К.',
      route: '303В Москва-Казань',
      amount: 3200,
      paymentMethod: 'card',
      status: 'refunded',
      date: '2024-01-14T15:45:00Z',
      agent: 'Касса #1'
    }
  ];

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' || t.status === filter
  );

  const stats = {
    total: transactions.reduce((sum, t) => sum + (t.status === 'refunded' ? -t.amount : t.amount), 0),
    completed: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    refunded: transactions.filter(t => t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0),
    count: transactions.length
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo/transport/manager" className="text-gray-400 hover:text-white transition-colors">
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Учёт билетов</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                Экспорт в Excel
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm">
                Новая продажа
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400 mb-2">{stats.total.toLocaleString()} ₽</div>
              <div className="text-sm text-gray-400">Общая выручка</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">{stats.completed.toLocaleString()} ₽</div>
              <div className="text-sm text-gray-400">Продажи</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-red-400 mb-2">{stats.refunded.toLocaleString()} ₽</div>
              <div className="text-sm text-gray-400">Возвраты</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">{stats.count}</div>
              <div className="text-sm text-gray-400">Транзакции</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-white/5 rounded-xl p-1">
              {(['all', 'completed', 'refunded', 'pending'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    filter === status ? 'bg-blue-500 text-white' : 'text-gray-400'
                  }`}
                >
                  {status === 'all' ? 'Все' : 
                   status === 'completed' ? 'Продажи' :
                   status === 'refunded' ? 'Возвраты' : 'В ожидании'}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Transactions Table */}
        <section>
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Билет</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Пассажир</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Маршрут</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Сумма</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Оплата</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Статус</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Дата</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono text-sm">{transaction.ticketNumber}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{transaction.passenger}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">{transaction.route}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`font-semibold ${
                          transaction.status === 'refunded' ? 'text-red-400' : 'text-white'
                        }`}>
                          {transaction.amount.toLocaleString()} ₽
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            transaction.paymentMethod === 'card' ? 'bg-blue-500' :
                            transaction.paymentMethod === 'cash' ? 'bg-green-500' : 'bg-purple-500'
                          }`} />
                          <span className="text-sm capitalize">
                            {transaction.paymentMethod === 'card' ? 'Карта' :
                             transaction.paymentMethod === 'cash' ? 'Наличные' : 'Онлайн'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          transaction.status === 'refunded' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {transaction.status === 'completed' ? 'Завершена' :
                           transaction.status === 'refunded' ? 'Возврат' : 'В ожидании'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                            Детали
                          </button>
                          {transaction.status === 'completed' && (
                            <button className="text-red-400 hover:text-red-300 transition-colors text-sm">
                              Возврат
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Shift Reconciliation */}
        <section className="mt-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Сверка смены</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">Касса #1</div>
                <div className="text-2xl font-bold text-white">12,500 ₽</div>
                <div className="text-sm text-green-400 mt-1">15 транзакций</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">Касса #2</div>
                <div className="text-2xl font-bold text-white">8,300 ₽</div>
                <div className="text-sm text-green-400 mt-1">9 транзакций</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">Онлайн</div>
                <div className="text-2xl font-bold text-white">24,800 ₽</div>
                <div className="text-sm text-green-400 mt-1">32 транзакции</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <button className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium">
                Завершить смену и сформировать отчёт
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}