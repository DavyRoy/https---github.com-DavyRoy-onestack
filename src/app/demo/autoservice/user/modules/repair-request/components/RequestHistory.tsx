'use client';

import React from 'react';

const REQUESTS = [
  {
    id: 1,
    car: 'BMW X5',
    licensePlate: 'А123БВ777',
    service: 'Диагностика ходовой части',
    date: '15.12.2023',
    status: 'completed',
    statusText: 'Завершён'
  },
  {
    id: 2,
    car: 'BMW X5',
    licensePlate: 'А123БВ777',
    service: 'Замена масла и фильтров',
    date: '10.10.2023',
    status: 'completed',
    statusText: 'Завершён'
  },
  {
    id: 3,
    car: 'BMW X5', 
    licensePlate: 'А123БВ777',
    service: 'Плановое ТО',
    date: '05.08.2023',
    status: 'completed',
    statusText: 'Завершён'
  }
];

const STATUS_COLORS = {
  pending: 'bg-orange-500/20 text-orange-300',
  in_progress: 'bg-blue-500/20 text-blue-300',
  completed: 'bg-green-500/20 text-green-300',
  cancelled: 'bg-red-500/20 text-red-300'
};

export default function RequestHistory() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-lg font-semibold mb-6">История заявок</h3>
      
      <div className="space-y-4">
        {REQUESTS.map((request) => (
          <div
            key={request.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-white">{request.car}</h4>
                <p className="text-white/60 text-sm">{request.licensePlate}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[request.status as keyof typeof STATUS_COLORS]}`}>
                {request.statusText}
              </span>
            </div>
            
            <p className="text-white/80 text-sm mb-2">{request.service}</p>
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>{request.date}</span>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300">
                Подробнее
              </button>
            </div>
          </div>
        ))}
      </div>

      {REQUESTS.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-white/60">У вас пока нет заявок</p>
        </div>
      )}
    </div>
  );
}