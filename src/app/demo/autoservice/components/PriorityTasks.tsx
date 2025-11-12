'use client';

import React from 'react';

const TASKS = [
  {
    id: 1,
    title: 'BMW X5 - Замена тормозных колодок',
    client: 'Александр Петров',
    deadline: 'Сегодня, 15:00',
    priority: 'high',
    status: 'in_progress',
    type: 'repair'
  },
  {
    id: 2,
    title: 'Audi Q7 - Диагностика двигателя',
    client: 'Мария Сидорова',
    deadline: 'Сегодня, 16:30',
    priority: 'medium',
    status: 'waiting_parts',
    type: 'diagnostics'
  },
  {
    id: 3,
    title: 'Mercedes GLE - Замена масла',
    client: 'Дмитрий Иванов',
    deadline: 'Завтра, 10:00',
    priority: 'low',
    status: 'scheduled',
    type: 'maintenance'
  },
  {
    id: 4,
    title: 'VW Tiguan - Ремонт подвески',
    client: 'Ольга Козлова',
    deadline: 'Вчера',
    priority: 'high',
    status: 'overdue',
    type: 'repair'
  }
];

const PRIORITY_COLORS = {
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
  medium: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  low: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
};

const STATUS_COLORS = {
  in_progress: 'text-blue-400',
  waiting_parts: 'text-orange-400',
  scheduled: 'text-green-400',
  overdue: 'text-red-400'
};

const TYPE_ICONS = {
  repair: '🔧',
  diagnostics: '🔍',
  maintenance: '🛢️'
};

export default function PriorityTasks() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Приоритетные задачи</h3>
        <button className="text-sm text-white/60 hover:text-white transition-colors">
          Создать задачу
        </button>
      </div>

      <div className="space-y-4">
        {TASKS.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
          >
            {/* Task Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">{TYPE_ICONS[task.type as keyof typeof TYPE_ICONS]}</span>
            </div>
            
            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-white truncate">{task.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs border ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}>
                  {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>{task.client}</span>
                <span>•</span>
                <span className={STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]}>
                  {task.status === 'in_progress' ? 'В работе' : 
                   task.status === 'waiting_parts' ? 'Ожидает запчасти' :
                   task.status === 'scheduled' ? 'Запланировано' : 'Просрочено'}
                </span>
              </div>
            </div>
            
            {/* Deadline & Actions */}
            <div className="text-right">
              <div className="text-sm text-white/60 mb-2">{task.deadline}</div>
              <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
                Взять в работу
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {TASKS.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-white/60">Все задачи выполнены!</p>
        </div>
      )}
    </div>
  );
}