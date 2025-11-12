'use client';

import React from 'react';

const ACTIVITIES = [
  {
    id: 1,
    type: 'repair',
    title: 'Заявка на ремонт принята',
    description: 'Диагностика ходовой части',
    time: '2 часа назад',
    icon: '📝',
    status: 'completed'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Счёт выставлен',
    description: 'Ожидает оплаты - 24 500 ₽',
    time: '5 часов назад',
    icon: '🧾',
    status: 'pending'
  },
  {
    id: 3,
    type: 'notification',
    title: 'Фотоотчёт добавлен',
    description: 'Мастер загрузил фото процесса',
    time: 'Вчера',
    icon: '📸',
    status: 'completed'
  },
  {
    id: 4,
    type: 'schedule',
    title: 'Запись подтверждена',
    description: 'Пятница, 11:30 - 13:00',
    time: '2 дня назад',
    icon: '📅',
    status: 'completed'
  }
];

const STATUS_COLORS = {
  completed: 'text-green-400',
  pending: 'text-orange-400',
  warning: 'text-red-400'
};

export default function ActivityFeed() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Лента событий</h3>
        <button className="text-sm text-white/60 hover:text-white transition-colors">
          Показать все
        </button>
      </div>

      <div className="space-y-4">
        {ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">{activity.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-white truncate">{activity.title}</h4>
                <span className={`text-xs ${STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS]}`}>
                  ●
                </span>
              </div>
              <p className="text-white/60 text-sm truncate">{activity.description}</p>
            </div>
            
            <div className="text-right">
              <span className="text-white/40 text-sm">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {ACTIVITIES.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📭</span>
          </div>
          <p className="text-white/60">Пока нет активностей</p>
        </div>
      )}
    </div>
  );
}