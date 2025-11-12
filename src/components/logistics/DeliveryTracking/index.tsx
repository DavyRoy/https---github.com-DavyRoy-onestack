'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockCouriers: Courier[] = [
  {
    id: '1',
    name: 'Алексей Смирнов',
    phone: '+7 912 345-67-90',
    vehicle: 'Hyundai Solaris',
    status: 'on_route',
    currentLocation: { lat: 55.7558, lng: 37.6173 },
    route: [
      {
        id: '1',
        orderId: 'ORD-001',
        address: 'Москва, ул. Арбат, д. 25',
        customer: 'Иван Петров',
        phone: '+7 912 345-67-89',
        status: 'pending',
        estimatedTime: '14:30',
        sequence: 1,
        coordinates: { lat: 55.7495, lng: 37.5903 }
      },
      {
        id: '2',
        orderId: 'ORD-002',
        address: 'Москва, ул. Тверская, д. 10',
        customer: 'Мария Иванова',
        phone: '+7 912 345-67-91',
        status: 'pending',
        estimatedTime: '15:15',
        sequence: 2,
        coordinates: { lat: 55.7576, lng: 37.6050 }
      }
    ]
  }
];

// Simple Map Component (заглушка для демо)
function SimpleMap({ couriers, selectedCourier, onCourierSelect }: any) {
  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-2xl bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-white/10 overflow-hidden">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Courier markers */}
      {couriers.map((courier: Courier) => (
        <button
          key={courier.id}
          onClick={() => onCourierSelect(courier)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            selectedCourier?.id === courier.id ? 'z-10 scale-110' : 'z-0'
          }`}
          style={{
            left: `${((courier.currentLocation.lng + 180) / 360) * 100}%`,
            top: `${((90 - courier.currentLocation.lat) / 180) * 100}%`,
          }}
        >
          <div className={`flex flex-col items-center ${
            selectedCourier?.id === courier.id ? 'scale-110' : ''
          }`}>
            <div className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center text-white font-bold text-sm
              ${courier.status === 'on_route' ? 'bg-green-500 border-green-300' : ''}
              ${courier.status === 'break' ? 'bg-yellow-500 border-yellow-300' : ''}
              ${courier.status === 'offline' ? 'bg-gray-500 border-gray-300' : ''}
            `}>
              🚗
            </div>
            <div className="mt-1 px-2 py-1 rounded-lg bg-black/80 backdrop-blur text-xs whitespace-nowrap">
              {courier.name}
            </div>
          </div>
        </button>
      ))}

      {/* Delivery points */}
      {selectedCourier?.route.map((point: DeliveryPoint) => (
        <div
          key={point.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${((point.coordinates.lng + 180) / 360) * 100}%`,
            top: `${((90 - point.coordinates.lat) / 180) * 100}%`,
          }}
        >
          <div className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs
            ${point.status === 'delivered' ? 'bg-green-500 border-green-300' : ''}
            ${point.status === 'arrived' ? 'bg-blue-500 border-blue-300' : ''}
            ${point.status === 'pending' ? 'bg-gray-500 border-gray-300' : ''}
          `}>
            {point.sequence}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur rounded-xl p-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-white">Курьер в пути</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span className="text-white">Точка доставки</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-white">Прибыл на место</span>
        </div>
      </div>
    </div>
  );
}

function CourierList({ couriers, selectedCourier, onCourierSelect }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Активные курьеры</h3>
      {couriers.map((courier: Courier) => (
        <div
          key={courier.id}
          onClick={() => onCourierSelect(courier)}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            selectedCourier?.id === courier.id
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`
                w-3 h-3 rounded-full
                ${courier.status === 'on_route' ? 'bg-green-500' : ''}
                ${courier.status === 'break' ? 'bg-yellow-500' : ''}
                ${courier.status === 'offline' ? 'bg-gray-500' : ''}
              `} />
              <span className="font-semibold text-white">{courier.name}</span>
            </div>
            <span className="text-sm text-gray-400">{courier.vehicle}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Статус</div>
              <div className="text-white">
                {courier.status === 'on_route' && 'В пути'}
                {courier.status === 'break' && 'Перерыв'}
                {courier.status === 'offline' && 'Неактивен'}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Осталось точек</div>
              <div className="text-white">
                {courier.route.filter(p => p.status === 'pending').length} из {courier.route.length}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RouteDetails({ courier }: { courier: Courier }) {
  if (!courier) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Маршрут курьера</h3>
      <div className="space-y-3">
        {courier.route.map((point, index) => (
          <div
            key={point.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${point.status === 'delivered' ? 'bg-green-500 text-white' : ''}
                  ${point.status === 'arrived' ? 'bg-blue-500 text-white' : ''}
                  ${point.status === 'pending' ? 'bg-gray-500 text-white' : ''}
                `}>
                  {point.sequence}
                </div>
                <div>
                  <div className="font-semibold text-white">Заказ {point.orderId}</div>
                  <div className="text-sm text-gray-400">{point.customer}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white">{point.estimatedTime}</div>
                <div className={`
                  text-xs px-2 py-1 rounded-full
                  ${point.status === 'delivered' ? 'bg-green-500/20 text-green-400' : ''}
                  ${point.status === 'arrived' ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${point.status === 'pending' ? 'bg-gray-500/20 text-gray-400' : ''}
                `}>
                  {point.status === 'delivered' && 'Доставлено'}
                  {point.status === 'arrived' && 'На месте'}
                  {point.status === 'pending' && 'Ожидает'}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-400 ml-9">{point.address}</div>
            <div className="text-sm text-gray-400 ml-9">{point.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeliveryTracking() {
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(mockCouriers[0]);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [filter, setFilter] = useState<'all' | 'in_transit' | 'delivered'>('all');

  const filteredCouriers = useMemo(() => {
    return mockCouriers.filter(courier => {
      if (filter === 'all') return true;
      if (filter === 'in_transit') return courier.status === 'on_route';
      if (filter === 'delivered') return courier.route.every(p => p.status === 'delivered');
      return true;
    });
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Трекинг доставки</h1>
          <p className="text-gray-400 mt-2">Отслеживание курьеров в реальном времени</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все курьеры</option>
            <option value="in_transit">В пути</option>
            <option value="delivered">Завершённые</option>
          </select>
          
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'map' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Карта
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Список
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{mockCouriers.length}</div>
          <div className="text-sm text-gray-400">Активных курьеров</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">
            {mockCouriers.reduce((acc, c) => acc + c.route.length, 0)}
          </div>
          <div className="text-sm text-gray-400">Всего доставок</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">
            {mockCouriers.reduce((acc, c) => acc + c.route.filter(p => p.status === 'delivered').length, 0)}
          </div>
          <div className="text-sm text-gray-400">Завершённых</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-yellow-400">
            {mockCouriers.reduce((acc, c) => acc + c.route.filter(p => p.status === 'pending').length, 0)}
          </div>
          <div className="text-sm text-gray-400">В ожидании</div>
        </div>
      </div>

      {/* Main Content */}
      {view === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SimpleMap
              couriers={filteredCouriers}
              selectedCourier={selectedCourier}
              onCourierSelect={setSelectedCourier}
            />
          </div>
          <div className="space-y-6">
            <CourierList
              couriers={filteredCouriers}
              selectedCourier={selectedCourier}
              onCourierSelect={setSelectedCourier}
            />
            {selectedCourier && <RouteDetails courier={selectedCourier} />}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCouriers.map(courier => (
            <div key={courier.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-3 h-3 rounded-full
                      ${courier.status === 'on_route' ? 'bg-green-500' : ''}
                      ${courier.status === 'break' ? 'bg-yellow-500' : ''}
                      ${courier.status === 'offline' ? 'bg-gray-500' : ''}
                    `} />
                    <div>
                      <h3 className="font-semibold text-white">{courier.name}</h3>
                      <p className="text-sm text-gray-400">{courier.vehicle} • {courier.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourier(courier)}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                  >
                    На карте
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {courier.route.map((point, index) => (
                    <div key={point.id} className="flex items-center gap-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${point.status === 'delivered' ? 'bg-green-500 text-white' : ''}
                        ${point.status === 'arrived' ? 'bg-blue-500 text-white' : ''}
                        ${point.status === 'pending' ? 'bg-gray-500 text-white' : ''}
                      `}>
                        {point.sequence}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{point.address}</div>
                        <div className="text-sm text-gray-400">{point.customer} • {point.phone}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">{point.estimatedTime}</div>
                        <div className={`
                          text-xs px-2 py-1 rounded-full
                          ${point.status === 'delivered' ? 'bg-green-500/20 text-green-400' : ''}
                          ${point.status === 'arrived' ? 'bg-blue-500/20 text-blue-400' : ''}
                          ${point.status === 'pending' ? 'bg-gray-500/20 text-gray-400' : ''}
                        `}>
                          {point.status === 'delivered' && 'Доставлено'}
                          {point.status === 'arrived' && 'На месте'}
                          {point.status === 'pending' && 'Ожидает'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}