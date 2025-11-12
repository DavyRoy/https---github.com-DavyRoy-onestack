'use client';

import React from 'react';

const scheduleStats = [
  { master: 'Иван Петров', workload: 85, today: 4, completed: 3 },
  { master: 'Алексей Смирнов', workload: 78, today: 3, completed: 2 },
  { master: 'Михаил Козлов', workload: 92, today: 5, completed: 4 },
  { master: 'Дмитрий Новиков', workload: 65, today: 2, completed: 1 },
];

export default function ScheduleStats() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="font-semibold mb-4">Загрузка мастеров</h3>
      
      <div className="space-y-4">
        {scheduleStats.map((stat, index) => (
          <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white text-sm">{stat.master}</span>
              <span className={`text-xs font-medium ${
                stat.workload >= 90 ? 'text-red-400' :
                stat.workload >= 80 ? 'text-orange-400' :
                stat.workload >= 70 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {stat.workload}%
              </span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  stat.workload >= 90 ? 'bg-red-500' :
                  stat.workload >= 80 ? 'bg-orange-500' :
                  stat.workload >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${stat.workload}%` }}
              />
            </div>
            
            <div className="flex justify-between text-white/60 text-xs">
              <span>Сегодня: {stat.today}</span>
              <span>Выполнено: {stat.completed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}