'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { timetableDemoData } from './demo-data';

export default function TimetablePage() {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    transportType: 'all'
  });

  const filteredTrips = timetableDemoData.filter(trip => {
    const matchesFrom = searchParams.from ? trip.from.toLowerCase().includes(searchParams.from.toLowerCase()) : true;
    const matchesTo = searchParams.to ? trip.to.toLowerCase().includes(searchParams.to.toLowerCase()) : true;
    const matchesType = searchParams.transportType !== 'all' ? trip.type === searchParams.transportType : true;
    
    return matchesFrom && matchesTo && matchesType;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/demo/transport/user" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Онлайн-расписание</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                Фильтр
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm">
                Поиск
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Search Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Откуда</label>
              <input
                type="text"
                value={searchParams.from}
                onChange={(e) => setSearchParams(prev => ({ ...prev, from: e.target.value }))}
                placeholder="Город отправления"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Куда</label>
              <input
                type="text"
                value={searchParams.to}
                onChange={(e) => setSearchParams(prev => ({ ...prev, to: e.target.value }))}
                placeholder="Город назначения"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Дата</label>
              <input
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Тип ТС</label>
              <select
                value={searchParams.transportType}
                onChange={(e) => setSearchParams(prev => ({ ...prev, transportType: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">Все</option>
                <option value="bus">Автобус</option>
                <option value="minibus">Маршрутка</option>
                <option value="trolleybus">Троллейбус</option>
                <option value="tram">Трамвай</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Найдено рейсов: {filteredTrips.length}</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Сортировка:</span>
              <select className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm">
                <option>По времени</option>
                <option>По цене</option>
                <option>По длительности</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-3xl">{trip.icon}</div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{trip.departureTime}</div>
                        <div className="text-sm text-gray-400">{trip.from}</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-400">{trip.duration}</div>
                        <div className="w-24 h-px bg-white/20 my-2" />
                        <div className="text-xs text-gray-500">{trip.stops} остановок</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{trip.arrivalTime}</div>
                        <div className="text-sm text-gray-400">{trip.to}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{trip.price} ₽</div>
                      <div className={`text-sm px-2 py-1 rounded-full ${
                        trip.status === 'ontime' 
                          ? 'bg-green-500/20 text-green-400' 
                          : trip.status === 'delayed'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trip.status === 'ontime' ? 'По расписанию' : 
                         trip.status === 'delayed' ? `Задержка ${trip.delay}` : 'Отменен'}
                      </div>
                    </div>
                    
                    <button className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium">
                      Выбрать
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-400">№ {trip.number}</span>
                  <span className="text-sm text-gray-400">{trip.carrier}</span>
                  <span className="text-sm text-gray-400">{trip.typeLabel}</span>
                  {trip.freeSeats > 0 && (
                    <span className="text-sm text-green-400">{trip.freeSeats} мест</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}