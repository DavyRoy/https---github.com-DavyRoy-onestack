'use client';

import React from 'react';

const metrics = [
  {
    title: 'Загрузка боксов',
    value: '81%',
    target: '85%',
    trend: 'up',
    color: 'text-blue-400'
  },
  {
    title: 'Средний чек',
    value: '14.6K ₽',
    target: '15.0K ₽',
    trend: 'up',
    color: 'text-green-400'
  },
  {
    title: 'Время ремонта',
    value: '2.3 дня',
    target: '2.0 дня',
    trend: 'down',
    color: 'text-orange-400'
  },
  {
    title: 'NPS',
    value: '4.7',
    target: '4.8',
    trend: 'up',
    color: 'text-purple-400'
  }
];

export default function PerformanceMetrics() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-lg font-semibold mb-6">Ключевые метрики</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white/80 text-sm">{metric.title}</h4>
              <div className={`text-xs px-2 py-1 rounded-full ${
                metric.trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'
              }`}>
                {metric.trend === 'up' ? '📈' : '📉'}
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-white/60 text-sm">
                цель: {metric.target}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metric.trend === 'up' ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ 
                  width: metric.title === 'Загрузка боксов' ? '81%' :
                         metric.title === 'Средний чек' ? '97%' :
                         metric.title === 'Время ремонта' ? '115%' : '98%'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="text-center">
          <div className="text-green-400 text-2xl font-bold mb-1">+8.2%</div>
          <div className="text-white/60 text-sm">Общая эффективность</div>
        </div>
      </div>
    </div>
  );
}