'use client';

import React, { useState } from 'react';

interface RevenueData {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
  averageTicket: number;
}

interface ServicePerformance {
  service: string;
  revenue: number;
  count: number;
  growth: number;
}

const REVENUE_DATA: RevenueData[] = [
  { date: 'Янв', revenue: 1200000, profit: 360000, orders: 98, averageTicket: 12245 },
  { date: 'Фев', revenue: 1350000, profit: 405000, orders: 105, averageTicket: 12857 },
  { date: 'Мар', revenue: 1480000, profit: 444000, orders: 112, averageTicket: 13214 },
  { date: 'Апр', revenue: 1620000, profit: 486000, orders: 118, averageTicket: 13729 },
  { date: 'Май', revenue: 1850000, profit: 555000, orders: 125, averageTicket: 14800 },
  { date: 'Июн', revenue: 2100000, profit: 630000, orders: 132, averageTicket: 15909 },
  { date: 'Июл', revenue: 2350000, profit: 705000, orders: 142, averageTicket: 16549 },
  { date: 'Авг', revenue: 2520000, profit: 756000, orders: 148, averageTicket: 17027 },
  { date: 'Сен', revenue: 2680000, profit: 804000, orders: 152, averageTicket: 17632 },
  { date: 'Окт', revenue: 2450000, profit: 735000, orders: 146, averageTicket: 16781 },
  { date: 'Ноя', revenue: 2200000, profit: 660000, orders: 138, averageTicket: 15942 },
  { date: 'Дек', revenue: 2800000, profit: 840000, orders: 156, averageTicket: 17949 },
];

const SERVICE_PERFORMANCE: ServicePerformance[] = [
  { service: 'Техническое обслуживание', revenue: 1250000, count: 85, growth: 12.5 },
  { service: 'Ремонт двигателя', revenue: 980000, count: 42, growth: 8.2 },
  { service: 'Кузовной ремонт', revenue: 750000, count: 28, growth: 15.3 },
  { service: 'Ремонт подвески', revenue: 620000, count: 56, growth: 6.7 },
  { service: 'Электрика', revenue: 480000, count: 38, growth: 9.8 },
  { service: 'Шиномонтаж', revenue: 320000, count: 124, growth: 4.2 },
];

export default function ServiceRevenue() {
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('year');
  const [selectedService, setSelectedService] = useState<string>('all');

  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue));
  const maxProfit = Math.max(...REVENUE_DATA.map(d => d.profit));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
            >
              <option value="month">За месяц</option>
              <option value="quarter">За квартал</option>
              <option value="year">За год</option>
            </select>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-white/30"
            >
              <option value="all">Все услуги</option>
              {SERVICE_PERFORMANCE.map(service => (
                <option key={service.service} value={service.service}>{service.service}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
              📊 Настроить вид
            </button>
            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
              📥 Экспорт данных
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-6">Динамика выручки и прибыли</h2>
        
        <div className="h-80 flex items-end justify-between gap-2 mb-8">
          {REVENUE_DATA.map((data, index) => (
            <div key={data.date} className="flex-1 flex flex-col items-center">
              <div className="flex flex-col items-center w-full max-w-12 gap-1">
                {/* Revenue Bar */}
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 hover:from-blue-400 hover:to-blue-500 cursor-pointer"
                  style={{ 
                    height: `${(data.revenue / maxRevenue) * 60}%`,
                    minHeight: '4px'
                  }}
                  title={`Выручка: ${formatCurrency(data.revenue)}`}
                />
                
                {/* Profit Bar */}
                <div
                  className="w-3/4 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg transition-all duration-300 hover:from-green-400 hover:to-green-500 cursor-pointer"
                  style={{ 
                    height: `${(data.profit / maxProfit) * 60}%`,
                    minHeight: '2px'
                  }}
                  title={`Прибыль: ${formatCurrency(data.profit)}`}
                />
              </div>
              
              <div className="text-white/60 text-xs mt-2">{data.date}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-white/60 text-sm">Выручка</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-white/60 text-sm">Прибыль</span>
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-6">Эффективность услуг</h2>
        
        <div className="space-y-4">
          {SERVICE_PERFORMANCE.map((service, index) => (
            <div key={service.service} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-white">{service.service}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    service.growth >= 10 
                      ? 'bg-green-500/20 text-green-300'
                      : service.growth >= 5
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-orange-500/20 text-orange-300'
                  }`}>
                    {service.growth > 0 ? '+' : ''}{service.growth}%
                  </span>
                </div>
                <div className="text-white/60 text-sm">
                  {service.count} заказов • {formatCurrency(service.revenue)}
                </div>
              </div>
              
              <div className="w-32">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${(service.revenue / Math.max(...SERVICE_PERFORMANCE.map(s => s.revenue))) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Ticket Size */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="font-semibold mb-4">Динамика среднего чека</h3>
          <div className="space-y-3">
            {REVENUE_DATA.slice(-6).map(data => (
              <div key={data.date} className="flex items-center justify-between">
                <span className="text-white/60 text-sm">{data.date}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{data.averageTicket.toLocaleString()} ₽</span>
                  <span className="text-green-400 text-xs">+5.2%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Volume */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h3 className="font-semibold mb-4">Объём заказов</h3>
          <div className="space-y-3">
            {REVENUE_DATA.slice(-6).map(data => (
              <div key={data.date} className="flex items-center justify-between">
                <span className="text-white/60 text-sm">{data.date}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{data.orders}</span>
                  <span className="text-blue-400 text-xs">+{Math.round((data.orders / 100) * 8)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}