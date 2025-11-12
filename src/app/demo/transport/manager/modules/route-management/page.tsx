'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Route {
  id: string;
  number: string;
  name: string;
  type: 'bus' | 'minibus' | 'trolleybus' | 'tram';
  status: 'active' | 'inactive' | 'draft';
  stops: string[];
  schedule: string[];
  duration: string;
  vehicles: number;
  lastUpdated: string;
}

export default function RouteManagementPage() {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: '1',
      number: '101А',
      name: 'Москва - Санкт-Петербург',
      type: 'bus',
      status: 'active',
      stops: ['Москва (Центральный)', 'Тверь', 'Вышний Волочек', 'СПб (Автово)'],
      schedule: ['08:00', '14:00', '22:00'],
      duration: '8h 30m',
      vehicles: 3,
      lastUpdated: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      number: '202Б',
      name: 'Москва - Нижний Новгород',
      type: 'minibus',
      status: 'active',
      stops: ['Москва (Щёлковская)', 'Владимир', 'Нижний Новгород (Центральный)'],
      schedule: ['07:30', '12:00', '18:30'],
      duration: '6h 15m',
      vehicles: 2,
      lastUpdated: '2024-01-14T15:30:00Z'
    },
    {
      id: '3',
      number: '303В',
      name: 'Москва - Казань',
      type: 'bus',
      status: 'draft',
      stops: ['Москва (Южные Ворота)', 'Владимир', 'Нижний Новгород', 'Казань (Центральный)'],
      schedule: ['09:00', '16:00'],
      duration: '11h 30m',
      vehicles: 0,
      lastUpdated: '2024-01-13T11:20:00Z'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);

  const handleStatusChange = (routeId: string, newStatus: Route['status']) => {
    setRoutes(prev => prev.map(route =>
      route.id === routeId ? { ...route, status: newStatus } : route
    ));
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
              <span className="text-white font-medium">Управление маршрутами</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                Экспорт
              </button>
              <button 
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm"
              >
                + Создать маршрут
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
              <div className="text-2xl font-bold text-white mb-2">{routes.length}</div>
              <div className="text-sm text-gray-400">Всего маршрутов</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">
                {routes.filter(r => r.status === 'active').length}
              </div>
              <div className="text-sm text-gray-400">Активные</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">
                {routes.reduce((acc, route) => acc + route.vehicles, 0)}
              </div>
              <div className="text-sm text-gray-400">Транспортных средств</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">
                {routes.reduce((acc, route) => acc + route.stops.length, 0)}
              </div>
              <div className="text-sm text-gray-400">Остановок</div>
            </div>
          </div>
        </section>

        {/* Routes List */}
        <section>
          <div className="space-y-6">
            {routes.map(route => (
              <div
                key={route.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {route.type === 'bus' ? '🚌' :
                       route.type === 'minibus' ? '🚐' :
                       route.type === 'trolleybus' ? '🚎' : '🚋'}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">Маршрут {route.number}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          route.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          route.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {route.status === 'active' ? 'Активен' :
                           route.status === 'inactive' ? 'Неактивен' : 'Черновик'}
                        </span>
                      </div>
                      <p className="text-gray-400">{route.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <select
                      value={route.status}
                      onChange={(e) => handleStatusChange(route.id, e.target.value as Route['status'])}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    >
                      <option value="draft">Черновик</option>
                      <option value="active">Активен</option>
                      <option value="inactive">Неактивен</option>
                    </select>
                    
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                      Редактировать
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-400 mb-2">Остановки</h4>
                    <div className="space-y-1">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-400 mb-2">Расписание</h4>
                    <div className="flex flex-wrap gap-2">
                      {route.schedule.map((time, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-white/5 text-white/80 text-sm"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-400 mb-2">Информация</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Длительность:</span>
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Транспорт:</span>
                        <span>{route.vehicles} ед.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Обновлён:</span>
                        <span>{new Date(route.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    ID: {route.id}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      Клонировать
                    </button>
                    <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Create Route Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Создание нового маршрута</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Номер маршрута</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="101А"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Тип транспорта</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors">
                      <option value="bus">Автобус</option>
                      <option value="minibus">Маршрутка</option>
                      <option value="trolleybus">Троллейбус</option>
                      <option value="tram">Трамвай</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Название маршрута</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Москва - Санкт-Петербург"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    Отмена
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium">
                    Создать маршрут
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}