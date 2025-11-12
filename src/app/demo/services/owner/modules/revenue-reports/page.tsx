'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
  averageTicket: number;
}

interface KPI {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

const REVENUE_DATA: RevenueData[] = [
  { date: '1 ноя', revenue: 245000, transactions: 167, averageTicket: 1467 },
  { date: '2 ноя', revenue: 287000, transactions: 189, averageTicket: 1518 },
  { date: '3 ноя', revenue: 312000, transactions: 203, averageTicket: 1537 },
  { date: '4 ноя', revenue: 298000, transactions: 195, averageTicket: 1528 },
  { date: '5 ноя', revenue: 324000, transactions: 208, averageTicket: 1558 },
  { date: '6 ноя', revenue: 301000, transactions: 192, averageTicket: 1568 },
  { date: '7 ноя', revenue: 289000, transactions: 184, averageTicket: 1571 },
];

const KPI_DATA: KPI[] = [
  { label: 'Общая выручка', value: '1.76M ₽', change: 12.5, trend: 'up' },
  { label: 'Средний чек', value: '1,547 ₽', change: 4.2, trend: 'up' },
  { label: 'Кол-во транзакций', value: '1,238', change: 8.1, trend: 'up' },
  { label: 'Конверсия', value: '34.2%', change: -2.1, trend: 'down' },
];

export default function RevenueReportsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'transactions' | 'averageTicket'>('revenue');

  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo/services/owner"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад к дашборду
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-semibold">Аналитика выручки</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Экспорт CSV
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                PDF отчет
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <div className="flex gap-2">
            {(['week', 'month', 'quarter'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  dateRange === range
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {range === 'week' && 'Неделя'}
                {range === 'month' && 'Месяц'}
                {range === 'quarter' && 'Квартал'}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {([
              { id: 'revenue', label: 'Выручка' },
              { id: 'transactions', label: 'Транзакции' },
              { id: 'averageTicket', label: 'Средний чек' }
            ] as const).map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  selectedMetric === metric.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {KPI_DATA.map((kpi, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="text-sm text-gray-400">{kpi.label}</div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span>{kpi.trend === 'up' ? '↗' : '↘'}</span>
                    <span>{Math.abs(kpi.change)}%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  vs предыдущий период
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {selectedMetric === 'revenue' && 'Динамика выручки'}
              {selectedMetric === 'transactions' && 'Количество транзакций'}
              {selectedMetric === 'averageTicket' && 'Средний чек'}
            </h2>
            <div className="text-sm text-gray-400">
              {dateRange === 'week' && 'За последние 7 дней'}
              {dateRange === 'month' && 'За последние 30 дней'}
              {dateRange === 'quarter' && 'За последние 90 дней'}
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {REVENUE_DATA.map((data, index) => {
              const value = data[selectedMetric];
              const percentage = (value / maxRevenue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="text-xs text-gray-400 text-center mb-2">
                    {selectedMetric === 'revenue' && `${(value / 1000).toFixed(0)}k`}
                    {selectedMetric === 'transactions' && value}
                    {selectedMetric === 'averageTicket' && `${value} ₽`}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${percentage * 0.8}%` }}
                  />
                  <div className="text-xs text-gray-400">{data.date}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold">Детализация по дням</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Дата</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Выручка</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Транзакции</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Средний чек</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Тренд</th>
                </tr>
              </thead>
              <tbody>
                {REVENUE_DATA.map((data, index) => (
                  <tr key={index} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-sm">{data.date}</td>
                    <td className="py-4 px-6 text-sm text-right font-semibold">
                      {data.revenue.toLocaleString()} ₽
                    </td>
                    <td className="py-4 px-6 text-sm text-right">{data.transactions}</td>
                    <td className="py-4 px-6 text-sm text-right">{data.averageTicket} ₽</td>
                    <td className="py-4 px-6 text-sm text-right">
                      <span className={`inline-flex items-center space-x-1 ${
                        index > 0 && data.revenue > REVENUE_DATA[index - 1].revenue
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        <span>
                          {index > 0 && data.revenue > REVENUE_DATA[index - 1].revenue ? '↗' : '↘'}
                        </span>
                        <span>
                          {index > 0 
                            ? `${Math.abs(
                                ((data.revenue - REVENUE_DATA[index - 1].revenue) / REVENUE_DATA[index - 1].revenue) * 100
                              ).toFixed(1)}%`
                            : '-'
                          }
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Revenue by Category */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-6">Выручка по категориям</h3>
            <div className="space-y-4">
              {[
                { category: 'Парикмахерская', revenue: 845000, percentage: 48 },
                { category: 'Ногтевой сервис', revenue: 523000, percentage: 30 },
                { category: 'Уход', revenue: 287000, percentage: 16 },
                { category: 'Массаж', revenue: 105000, percentage: 6 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span>{item.revenue.toLocaleString()} ₽ ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-6">Ключевые метрики</h3>
            <div className="space-y-4">
              {[
                { label: 'ROI маркетинга', value: '247%', trend: 'up' },
                { label: 'Стоимость привлечения', value: '320 ₽', trend: 'down' },
                { label: 'Удержание клиентов', value: '68%', trend: 'up' },
                { label: 'Повторные посещения', value: '42%', trend: 'up' },
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                  <span className="text-sm text-gray-400">{metric.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{metric.value}</span>
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.trend === 'up' ? '↗' : '↘'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}