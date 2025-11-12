'use client';

import React from 'react';

const notificationStats = [
  { channel: 'SMS', sent: 1248, delivered: 1205, rate: 96.5 },
  { channel: 'Email', sent: 856, delivered: 812, rate: 94.9 },
  { channel: 'Push', sent: 342, delivered: 298, rate: 87.1 },
];

export default function NotificationStats() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="font-semibold mb-4">Статистика отправки</h3>
      
      <div className="space-y-4">
        {notificationStats.map((stat, index) => (
          <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white text-sm">{stat.channel}</span>
              <span className={`text-xs font-medium ${
                stat.rate >= 95 ? 'text-green-400' :
                stat.rate >= 90 ? 'text-yellow-400' : 'text-orange-400'
              }`}>
                {stat.rate}%
              </span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  stat.rate >= 95 ? 'bg-green-500' :
                  stat.rate >= 90 ? 'bg-yellow-500' : 'bg-orange-500'
                }`}
                style={{ width: `${stat.rate}%` }}
              />
            </div>
            
            <div className="flex justify-between text-white/60 text-xs">
              <span>Отправлено: {stat.sent}</span>
              <span>Доставлено: {stat.delivered}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}