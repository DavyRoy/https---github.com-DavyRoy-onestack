'use client';

import React from 'react';

const ratingDistribution = [
  { stars: 5, count: 89, percentage: 57 },
  { stars: 4, count: 42, percentage: 27 },
  { stars: 3, count: 15, percentage: 10 },
  { stars: 2, count: 6, percentage: 4 },
  { stars: 1, count: 4, percentage: 2 },
];

export default function ReviewStats() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="font-semibold mb-4">Распределение оценок</h3>
      
      <div className="space-y-3">
        {ratingDistribution.map((item) => (
          <div key={item.stars} className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-24">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`text-sm ${
                      index < item.stars ? 'text-yellow-400' : 'text-white/20'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-white/60 text-sm">{item.stars}</span>
            </div>
            
            <div className="flex-1 max-w-32">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
            
            <span className="text-white/60 text-sm w-8 text-right">
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">92%</div>
            <div className="text-white/60 text-xs">Рекомендуют</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">64</div>
            <div className="text-white/60 text-xs">NPS Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}