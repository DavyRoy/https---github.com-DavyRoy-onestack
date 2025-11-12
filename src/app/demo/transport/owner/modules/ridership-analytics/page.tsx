'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RidershipAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const routes = [
    { id: 'all', name: 'Все маршруты' },
    { id: '101А', name: '101А Москва-СПб' },
    { id: '202Б', name: '202Б Москва-НН' },
    { id: '303В', name: '303В Москва-Казань' }
  ];

  const analyticsData = {
    totalPassengers: 27400,
    occupancyRate: 68,
    revenue: 3200000,
    avgTicketPrice: 1167,
    peakHours: ['08:00', '18:00'],
    popularRoutes: [
      { route: '101А Москва-СПб', passengers: 8900, revenue: 10300000 },
      { route: '202Б Москва-НН', passengers: 7200, revenue: 5200000 },
      { route: '303В Москва-Казань', passengers: 4500, revenue: 5400000 }
    ],
    hourlyData: [
      { hour: '00-02', passengers: 120 },
      { hour: '02-04', passengers: 80 },
      { hour: '04-06', passengers: 450 },
      { hour: '06-08', passengers: 3200 },
      { hour: '08-10', passengers: 4800 },
      { hour: '10-12', passengers: 3500 },
      { hour: '12-14', passengers: 3100 },
      { hour: '14-16', passengers: 2800 },
      { hour: '16-18', passengers: 4200 },
      { hour: '18-20', passengers: 3800 },
      { hour: '20-22', passengers: 2100 },
      { hour: '22-24', passengers: 800 }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo/transport/owner" className="text-gray-400 hover:text-white transition-colors">
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Аналитика пассажиропотока</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                Экспорт отчёта
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm">
                Обновить данные
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-white/5 rounded-xl p-1">
              {(['day', 'week', 'month', 'year'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    timeRange === range ? 'bg-blue-500 text-white' : 'text-gray-400'
                  }`}
                >
                  {range === 'day' ? 'День' :
                   range === 'week' ? 'Неделя' :
                   range === 'month' ? 'Месяц' : 'Год'}
                </button>
              ))}
            </div>

            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
            >
              {routes.map(route => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">
                {analyticsData.totalPassengers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Пассажиров за день</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">{analyticsData.occupancyRate}%</div>
              <div className="text-sm text-gray-400">Средняя заполняемость</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">
                {(analyticsData.revenue / 1000000).toFixed(1)}M ₽
              </div>
              <div className="text-sm text-gray-400">Выручка за день</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">{analyticsData.avgTicketPrice} ₽</div>
              <div className="text-sm text-gray-400">Средний чек</div>
            </div>
          </div>
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Passengers Chart */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-6">Пассажиропоток по часам</h3>
            <div className="space-y-3">
              {analyticsData.hourlyData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-400">{data.hour}</div>
                  <div className="flex-1">
                    <div className="h-8 rounded-lg bg-blue-500/20 relative">
                      <div
                        className="h-8 rounded-lg bg-blue-500 transition-all duration-500"
                        style={{ width: `${(data.passengers / 5000) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <span className="text-xs font-medium">{data.passengers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Popularity */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-6">Популярность маршрутов</h3>
            <div className="space-y-4">
              {analyticsData.popularRoutes.map((route, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{route.route}</span>
                    <span className="text-sm text-gray-400">{route.passengers.toLocaleString()} пасс.</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-500"
                      style={{ width: `${(route.passengers / 10000) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Выручка: {route.revenue.toLocaleString()} ₽</span>
                    <span>{Math.round((route.passengers / analyticsData.totalPassengers) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Analytics */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Peak Hours */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Пиковые часы</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div>
                  <div className="font-semibold text-yellow-400">Утренний пик</div>
                  <div className="text-sm text-gray-400">08:00 - 10:00</div>
                </div>
                <div className="text-2xl font-bold text-yellow-400">4,800</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div>
                  <div className="font-semibold text-orange-400">Вечерний пик</div>
                  <div className="text-sm text-gray-400">16:00 - 18:00</div>
                </div>
                <div className="text-2xl font-bold text-orange-400">4,200</div>
              </div>
            </div>
          </div>

          {/* Segmentation */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Сегментация пассажиров</h3>
            <div className="space-y-3">
              {[
                { segment: 'Взрослые', percentage: 65, color: 'bg-blue-500' },
                { segment: 'Студенты', percentage: 20, color: 'bg-green-500' },
                { segment: 'Пенсионеры', percentage: 12, color: 'bg-purple-500' },
                { segment: 'Дети', percentage: 3, color: 'bg-yellow-500' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{item.segment}</span>
                    <span className="text-sm text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Forecast */}
        <section className="mt-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Прогноз на завтра</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400 mb-2">28,900</div>
                <div className="text-sm text-gray-400">Ожидаемое кол-во пассажиров</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="text-2xl font-bold text-green-400 mb-2">72%</div>
                <div className="text-sm text-gray-400">Прогноз заполняемости</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400 mb-2">3.4M ₽</div>
                <div className="text-sm text-gray-400">Прогноз выручки</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}