'use client';

import React from 'react';

const revenueData = [
  { month: 'Янв', revenue: 1200000, profit: 360000 },
  { month: 'Фев', revenue: 1350000, profit: 405000 },
  { month: 'Мар', revenue: 1480000, profit: 444000 },
  { month: 'Апр', revenue: 1620000, profit: 486000 },
  { month: 'Май', revenue: 1850000, profit: 555000 },
  { month: 'Июн', revenue: 2100000, profit: 630000 },
  { month: 'Июл', revenue: 2350000, profit: 705000 },
  { month: 'Авг', revenue: 2520000, profit: 756000 },
  { month: 'Сен', revenue: 2680000, profit: 804000 },
  { month: 'Окт', revenue: 2450000, profit: 735000 },
  { month: 'Ноя', revenue: 2200000, profit: 660000 },
  { month: 'Дек', revenue: 2800000, profit: 840000 },
];

export default function RevenueChart() {
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
  
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Динамика выручки</h3>
        <div className="flex gap-2">
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm">
            <option>За год</option>
            <option>За квартал</option>
            <option>За месяц</option>
          </select>
          <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
            Экспорт
          </button>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-2">
        {revenueData.map((data, index) => (
          <div key={data.month} className="flex-1 flex flex-col items-center">
            {/* Revenue Bar */}
            <div className="flex flex-col items-center w-full max-w-12">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-blue-400 hover:to-blue-500 cursor-pointer"
                style={{ 
                  height: `${(data.revenue / maxRevenue) * 80}%`,
                  minHeight: '4px'
                }}
                title={`Выручка: ${(data.revenue / 1000000).toFixed(1)}M ₽`}
              />
              
              {/* Profit Bar */}
              <div
                className="w-3/4 bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg mt-1 transition-all duration-500 hover:from-green-400 hover:to-green-500 cursor-pointer"
                style={{ 
                  height: `${(data.profit / maxRevenue) * 80}%`,
                  minHeight: '2px'
                }}
                title={`Прибыль: ${(data.profit / 1000).toFixed(0)}K ₽`}
              />
            </div>
            
            {/* Month Label */}
            <div className="text-white/60 text-xs mt-2">{data.month}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-white/60 text-sm">Выручка</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-white/60 text-sm">Прибыль</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center p-4 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-blue-400">
            {(revenueData[revenueData.length - 1].revenue / 1000000).toFixed(1)}M ₽
          </div>
          <div className="text-white/60 text-sm">Выручка за декабрь</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-green-400">
            {((revenueData[revenueData.length - 1].revenue / revenueData[revenueData.length - 2].revenue - 1) * 100).toFixed(1)}%
          </div>
          <div className="text-white/60 text-sm">Рост к ноябрю</div>
        </div>
      </div>
    </div>
  );
}