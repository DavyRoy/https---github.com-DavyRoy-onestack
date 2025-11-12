'use client';

import React, { useState } from 'react';

// Mock данные
const mockCourier: Courier = {
  id: '1',
  name: 'Алексей Смирнов',
  phone: '+7 912 345-67-90',
  vehicle: 'Hyundai Solaris (A123BC777)',
  status: 'on_route',
  completedToday: 8,
  rating: 4.8,
  currentRoute: [
    {
      id: '1',
      orderId: 'ORD-001',
      address: 'Москва, ул. Арбат, д. 25, кв. 5',
      customer: 'Иван Петров',
      phone: '+7 912 345-67-89',
      instructions: 'Звонить за 10 минут, домофон 25К',
      status: 'arrived',
      estimatedTime: '14:30',
      sequence: 1,
      coordinates: { lat: 55.7495, lng: 37.5903 }
    },
    {
      id: '2',
      orderId: 'ORD-002',
      address: 'Москва, ул. Тверская, д. 10, офис 45',
      customer: 'Мария Иванова',
      phone: '+7 912 345-67-91',
      instructions: 'Секретарь на ресепшене',
      status: 'pending',
      estimatedTime: '15:15',
      sequence: 2,
      coordinates: { lat: 55.7576, lng: 37.6050 }
    },
    {
      id: '3',
      orderId: 'ORD-003',
      address: 'Москва, пер. Камергерский, д. 4',
      customer: 'Сергей Козлов',
      phone: '+7 912 345-67-92',
      status: 'pending',
      estimatedTime: '16:00',
      sequence: 3,
      coordinates: { lat: 55.7602, lng: 37.6135 }
    }
  ]
};

function CourierHeader({ courier }: { courier: Courier }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl">
            🚗
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{courier.name}</h1>
            <p className="text-gray-400">{courier.vehicle}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{courier.completedToday}</div>
            <div className="text-sm text-gray-400">Выполнено</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{courier.rating}</div>
            <div className="text-sm text-gray-400">Рейтинг</div>
          </div>
          <div>
            <div className={`
              text-2xl font-bold
              ${courier.status === 'on_route' ? 'text-green-400' : ''}
              ${courier.status === 'break' ? 'text-yellow-400' : ''}
              ${courier.status === 'offline' ? 'text-gray-400' : ''}
            `}>
              {courier.status === 'on_route' && 'В пути'}
              {courier.status === 'break' && 'Перерыв'}
              {courier.status === 'offline' && 'Офлайн'}
            </div>
            <div className="text-sm text-gray-400">Статус</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryTask({ task, onStatusChange }: { task: DeliveryTask; onStatusChange: (taskId: string, status: DeliveryTask['status']) => void }) {
  const [showProofUpload, setShowProofUpload] = useState(false);

  const handleStatusChange = (newStatus: DeliveryTask['status']) => {
    if (newStatus === 'completed') {
      setShowProofUpload(true);
    } else {
      onStatusChange(task.id, newStatus);
    }
  };

  const handleProofUpload = () => {
    // Симуляция загрузки фото
    setTimeout(() => {
      onStatusChange(task.id, 'completed');
      setShowProofUpload(false);
      alert('Фото подтверждения загружено!');
    }, 1000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
            ${task.status === 'completed' ? 'bg-green-500 text-white' : ''}
            ${task.status === 'arrived' ? 'bg-blue-500 text-white' : ''}
            ${task.status === 'pending' ? 'bg-gray-500 text-white' : ''}
          `}>
            {task.sequence}
          </div>
          <div>
            <h3 className="font-semibold text-white">Заказ {task.orderId}</h3>
            <p className="text-sm text-gray-400">{task.customer} • {task.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-medium">{task.estimatedTime}</div>
          <div className={`
            text-xs px-2 py-1 rounded-full
            ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
            ${task.status === 'arrived' ? 'bg-blue-500/20 text-blue-400' : ''}
            ${task.status === 'pending' ? 'bg-gray-500/20 text-gray-400' : ''}
          `}>
            {task.status === 'completed' && 'Завершено'}
            {task.status === 'arrived' && 'На месте'}
            {task.status === 'pending' && 'Ожидает'}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-white mb-2">{task.address}</p>
        {task.instructions && (
          <p className="text-sm text-gray-400">📝 {task.instructions}</p>
        )}
      </div>

      <div className="flex gap-3">
        {task.status === 'pending' && (
          <button
            onClick={() => handleStatusChange('arrived')}
            className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white"
          >
            Прибыл на место
          </button>
        )}
        
        {task.status === 'arrived' && (
          <>
            <button
              onClick={() => handleStatusChange('completed')}
              className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition-colors text-white"
            >
              Завершить доставку
            </button>
            <button
              onClick={() => handleStatusChange('cancelled')}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-white"
            >
              Отменить
            </button>
          </>
        )}
        
        {task.status === 'completed' && (
          <div className="text-green-400 font-medium">
            ✅ Доставка завершена {task.actualTime}
          </div>
        )}
      </div>

      {/* Proof Upload Modal */}
      {showProofUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Подтверждение доставки</h3>
            <p className="text-gray-400 mb-4">Сделайте фото подтверждения доставки</p>
            
            <div className="aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-400">Нажмите для съёмки</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowProofUpload(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleProofUpload}
                className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RouteMap({ tasks }: { tasks: DeliveryTask[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Маршрут на карте</h3>
      <div className="relative w-full h-64 rounded-xl bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-white/10 overflow-hidden">
        {/* Упрощённая карта с точками маршрута */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${20 + (index * 25)}%`,
              top: '50%',
            }}
          >
            <div className={`
              w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
              ${task.status === 'completed' ? 'bg-green-500 border-green-300 text-white' : ''}
              ${task.status === 'arrived' ? 'bg-blue-500 border-blue-300 text-white' : ''}
              ${task.status === 'pending' ? 'bg-gray-500 border-gray-300 text-white' : ''}
            `}>
              {task.sequence}
            </div>
            <div className="mt-2 text-xs text-center text-white bg-black/80 rounded px-2 py-1 whitespace-nowrap">
              {task.orderId}
            </div>
          </div>
        ))}
        
        {/* Линия маршрута */}
        <div className="absolute top-1/2 left-10 right-10 h-1 bg-blue-500/30 -translate-y-1/2" />
      </div>
    </div>
  );
}

export default function CourierApp() {
  const [courier, setCourier] = useState(mockCourier);

  const handleStatusChange = (taskId: string, newStatus: DeliveryTask['status']) => {
    setCourier(prev => ({
      ...prev,
      currentRoute: prev.currentRoute.map(task =>
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              actualTime: newStatus === 'completed' ? new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : task.actualTime
            }
          : task
      ),
      completedToday: newStatus === 'completed' ? prev.completedToday + 1 : prev.completedToday
    }));
  };

  const pendingTasks = courier.currentRoute.filter(task => task.status === 'pending');
  const activeTasks = courier.currentRoute.filter(task => task.status !== 'completed' && task.status !== 'cancelled');

  return (
    <div className="space-y-6">
      <CourierHeader courier={courier} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Статистика маршрута */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white">{activeTasks.length}</div>
              <div className="text-sm text-gray-400">Осталось</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {pendingTasks.length}
              </div>
              <div className="text-sm text-gray-400">Впереди</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {courier.currentRoute.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-400">Выполнено</div>
            </div>
          </div>

          {/* Карта маршрута */}
          <RouteMap tasks={courier.currentRoute} />

          {/* Быстрые действия */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Быстрые действия</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors">
                📞 Экстренная связь
              </button>
              <button className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-colors">
                ☕ Перерыв
              </button>
              <button className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors">
                🗺️ Оптимизировать маршрут
              </button>
              <button className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors">
                🚨 Проблема с доставкой
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Текущий маршрут</h2>
          <div className="space-y-4">
            {courier.currentRoute.map(task => (
              <DeliveryTask
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}