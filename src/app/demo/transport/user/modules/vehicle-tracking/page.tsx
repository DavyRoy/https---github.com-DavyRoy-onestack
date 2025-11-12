'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Vehicle {
  id: string;
  number: string;
  type: 'bus' | 'minibus' | 'trolleybus' | 'tram';
  route: string;
  driver: string;
  status: 'in_transit' | 'stopped' | 'offline';
  coordinates: [number, number];
  speed: number;
  lastUpdate: string;
  eta?: string;
}

export default function VehicleTrackingPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  
  const vehicles: Vehicle[] = [
    {
      id: '1',
      number: 'А123БВ',
      type: 'bus',
      route: '101А',
      driver: 'Иванов П.С.',
      status: 'in_transit',
      coordinates: [55.7558, 37.6173],
      speed: 45,
      lastUpdate: '2024-01-15T10:30:00Z',
      eta: '15 мин'
    },
    {
      id: '2',
      number: 'В456ГД',
      type: 'minibus',
      route: '202Б',
      driver: 'Петров А.В.',
      status: 'stopped',
      coordinates: [55.7517, 37.6178],
      speed: 0,
      lastUpdate: '2024-01-15T10:28:00Z',
      eta: '8 мин'
    },
    {
      id: '3',
      number: 'Е789ЖЗ',
      type: 'bus',
      route: '303В',
      driver: 'Сидоров М.К.',
      status: 'in_transit',
      coordinates: [55.7490, 37.6142],
      speed: 32,
      lastUpdate: '2024-01-15T10:25:00Z',
      eta: '22 мин'
    }
  ];

  const routes = [
    { id: 'all', name: 'Все маршруты', count: vehicles.length },
    { id: '101А', name: 'Маршрут 101А', count: 1 },
    { id: '202Б', name: 'Маршрут 202Б', count: 1 },
    { id: '303В', name: 'Маршрут 303В', count: 1 }
  ];

  const filteredVehicles = selectedRoute === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.route === selectedRoute);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo/transport/user" className="text-gray-400 hover:text-white transition-colors">
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Отслеживание транспорта</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'map' ? 'bg-blue-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Карта
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Список
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4">
            {routes.map(route => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route.id)}
                className={`px-4 py-2 rounded-xl border transition-colors ${
                  selectedRoute === route.id
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                {route.name} ({route.count})
              </button>
            ))}
          </div>
        </section>

        {viewMode === 'map' ? (
          /* Map View */
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm h-96 lg:h-[600px] relative overflow-hidden">
                {/* Mock Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <div className="text-xl font-semibold mb-2">Интерактивная карта</div>
                    <div className="text-gray-400">В реальной системе здесь отображаются транспортные средства</div>
                  </div>
                </div>
                
                {/* Vehicle Markers */}
                {filteredVehicles.map(vehicle => (
                  <div
                    key={vehicle.id}
                    className="absolute w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"
                    style={{
                      left: `${(vehicle.coordinates[0] - 55.74) * 1000}%`,
                      top: `${(vehicle.coordinates[1] - 37.61) * 1000}%`,
                    }}
                  >
                    <div className="relative">
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-black/80 border border-white/20 text-xs whitespace-nowrap">
                        {vehicle.number} • {vehicle.route}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Vehicle List Sidebar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Транспортные средства</h3>
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        vehicle.status === 'in_transit' ? 'bg-green-500' :
                        vehicle.status === 'stopped' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <span className="font-semibold">{vehicle.number}</span>
                    </div>
                    <span className="text-sm text-gray-400">Маршрут {vehicle.route}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Водитель:</span>
                      <span>{vehicle.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Скорость:</span>
                      <span>{vehicle.speed} км/ч</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Статус:</span>
                      <span className={vehicle.status === 'in_transit' ? 'text-green-400' : 'text-yellow-400'}>
                        {vehicle.status === 'in_transit' ? 'В пути' : 'Остановлен'}
                      </span>
                    </div>
                    {vehicle.eta && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">ETA:</span>
                        <span className="text-blue-400">{vehicle.eta}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* List View */
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {vehicle.type === 'bus' ? '🚌' :
                         vehicle.type === 'minibus' ? '🚐' :
                         vehicle.type === 'trolleybus' ? '🚎' : '🚋'}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{vehicle.number}</div>
                        <div className="text-sm text-gray-400">Маршрут {vehicle.route}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'in_transit' ? 'bg-green-500/20 text-green-400' :
                      vehicle.status === 'stopped' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {vehicle.status === 'in_transit' ? 'В пути' : 'Остановлен'}
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Водитель:</span>
                      <span>{vehicle.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Скорость:</span>
                      <span>{vehicle.speed} км/ч</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Координаты:</span>
                      <span className="font-mono text-xs">
                        {vehicle.coordinates[0].toFixed(4)}, {vehicle.coordinates[1].toFixed(4)}
                      </span>
                    </div>
                    {vehicle.eta && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Прибытие:</span>
                        <span className="text-blue-400">{vehicle.eta}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs text-gray-400">
                      Обновлено: {new Date(vehicle.lastUpdate).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}