'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockDeliveryData: DeliveryMetrics[] = [
  { date: '2024-01-15', totalDeliveries: 58, onTime: 54, late: 4, averageTime: 2.5, p90Time: 3.8, region: 'Центр' },
  { date: '2024-01-14', totalDeliveries: 62, onTime: 57, late: 5, averageTime: 2.7, p90Time: 4.1, region: 'Центр' },
  { date: '2024-01-13', totalDeliveries: 45, onTime: 42, late: 3, averageTime: 2.3, p90Time: 3.5, region: 'Центр' },
];

const regionPerformance: RegionPerformance[] = [
  { region: 'Центр', totalDeliveries: 165, onTimeRate: 0.93, averageTime: 2.5, satisfaction: 4.8 },
  { region: 'Север', totalDeliveries: 89, onTimeRate: 0.87, averageTime: 3.2, satisfaction: 4.5 },
  { region: 'Юг', totalDeliveries: 76, onTimeRate: 0.91, averageTime: 2.8, satisfaction: 4.7 },
  { region: 'Запад', totalDeliveries: 54, onTimeRate: 0.85, averageTime: 3.5, satisfaction: 4.3 },
];

function PerformanceMetrics() {
  const overallMetrics = useMemo(() => {
    const total = mockDeliveryData.reduce((acc, day) => acc + day.totalDeliveries, 0);
    const onTime = mockDeliveryData.reduce((acc, day) => acc + day.onTime, 0);
    const averageTime = mockDeliveryData.reduce((acc, day) => acc + day.averageTime, 0) / mockDeliveryData.length;
    
    return {
      total,
      onTimeRate: onTime / total,
      averageTime,
      lateRate: (total - onTime) / total
    };
  }, []);

  const metrics = [
    {
      label: 'Общее количество доставок',
      value: overallMetrics.total,
      change: 12,
      target: 200,
      format: 'number'
    },
    {
      label: 'Вовремя доставлено',
      value: overallMetrics.onTimeRate,
      change: 2.3,
      target: 0.95,
      format: 'percentage'
    },
    {
      label: 'Среднее время доставки',
      value: overallMetrics.averageTime,
      change: -0.2,
      target: 2.0,
      format: 'time'
    },
    {
      label: 'Процент опозданий',
      value: overallMetrics.lateRate,
      change: -1.5,
      target: 0.03,
      format: 'percentage'
    }
  ];

  const formatValue = (metric: any) => {
    switch (metric.format) {
      case 'percentage':
        return `${(metric.value * 100).toFixed(1)}%`;
      case 'time':
        return `${metric.value.toFixed(1)} ч`;
      default:
        return metric.value.toLocaleString('ru-RU');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-2">{metric.label}</div>
          <div className="text-2xl font-bold text-white mb-2">
            {formatValue(metric)}
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-sm ${
              metric.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
            </div>
            <div className="text-xs text-gray-400">
              Цель: {metric.format === 'percentage' ? `${(metric.target * 100).toFixed(1)}%` : metric.target}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimeAnalysisChart() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Анализ времени доставки</h3>
      
      <div className="space-y-6">
        {/* Distribution */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Распределение времени доставки</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'До 2 часов', value: 45, color: 'bg-green-500' },
              { label: '2-4 часа', value: 35, color: 'bg-yellow-500' },
              { label: '4-6 часов', value: 15, color: 'bg-orange-500' },
              { label: 'Более 6 часов', value: 5, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-400">{item.label}</div>
                <div className="flex-1 bg-white/10 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <div className="w-8 text-sm text-white text-right">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">2.5ч</div>
            <div className="text-sm text-gray-400">Медиана</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">3.8ч</div>
            <div className="text-sm text-gray-400">P90</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">6.2ч</div>
            <div className="text-sm text-gray-400">Максимум</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegionPerformanceTable() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Эффективность по регионам</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Регион</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Доставки</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Вовремя</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Среднее время</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Удовлетворённость</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-white">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {regionPerformance.map((region, index) => (
              <tr key={index} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-white">{region.region}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-white">{region.totalDeliveries}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="text-white">{(region.onTimeRate * 100).toFixed(1)}%</div>
                    <div className={`text-xs ${
                      region.onTimeRate >= 0.9 ? 'text-green-400' : 
                      region.onTimeRate >= 0.8 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {region.onTimeRate >= 0.9 ? '✓' : '⚠'}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-white">{region.averageTime.toFixed(1)} ч</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="text-white">{region.satisfaction}/5</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < Math.floor(region.satisfaction) 
                              ? 'bg-yellow-400' 
                              : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className={`
                    text-xs px-2 py-1 rounded-full
                    ${region.onTimeRate >= 0.9 ? 'bg-green-500/20 text-green-400' : ''}
                    ${region.onTimeRate >= 0.8 && region.onTimeRate < 0.9 ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    ${region.onTimeRate < 0.8 ? 'bg-red-500/20 text-red-400' : ''}
                  `}>
                    {region.onTimeRate >= 0.9 && 'Отлично'}
                    {region.onTimeRate >= 0.8 && region.onTimeRate < 0.9 && 'Хорошо'}
                    {region.onTimeRate < 0.8 && 'Требует внимания'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CorrelationAnalysis() {
  const factors = [
    { factor: 'Загрузка курьеров', correlation: 0.78, impact: 'высокий' },
    { factor: 'Погодные условия', correlation: 0.65, impact: 'средний' },
    { factor: 'Время суток', correlation: 0.72, impact: 'высокий' },
    { factor: 'День недели', correlation: 0.58, impact: 'средний' },
    { factor: 'Расстояние', correlation: 0.81, impact: 'высокий' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Факторы влияния на время доставки</h3>
      
      <div className="space-y-4">
        {factors.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-white font-medium">{item.factor}</div>
              <div className="text-sm text-gray-400">Корреляция: {(item.correlation * 100).toFixed(1)}%</div>
            </div>
            <div className={`
              px-3 py-1 rounded-full text-sm
              ${item.impact === 'высокий' ? 'bg-red-500/20 text-red-400' : ''}
              ${item.impact === 'средний' ? 'bg-yellow-500/20 text-yellow-400' : ''}
              ${item.impact === 'низкий' ? 'bg-green-500/20 text-green-400' : ''}
            `}>
              {item.impact}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeliveryAnalytics() {
  const [timeRange, setTimeRange] = useState('7days');
  const [view, setView] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Аналитика времени доставки</h1>
          <p className="text-gray-400 mt-2">Глубокий анализ эффективности и факторов влияния на доставку</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            <option value="7days">7 дней</option>
            <option value="30days">30 дней</option>
            <option value="90days">90 дней</option>
            <option value="custom">Произвольный период</option>
          </select>
          
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setView('overview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'overview' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Обзор
            </button>
            <button
              onClick={() => setView('regions')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'regions' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              По регионам
            </button>
            <button
              onClick={() => setView('factors')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'factors' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Факторы
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeAnalysisChart />
        <CorrelationAnalysis />
      </div>

      {/* Region Performance */}
      <RegionPerformanceTable />

      {/* Insights */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ключевые инсайты</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="text-green-400 font-semibold mb-2">📈 Положительные тренды</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Снижение среднего времени на 12%</li>
              <li>• Улучшение P90 на 8%</li>
              <li>• Рост удовлетворённости клиентов</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="text-yellow-400 font-semibold mb-2">⚠️ Области для улучшения</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Западный регион отстаёт по времени</li>
              <li>• Пиковые часы нагрузки</li>
              <li>• Влияние погодных условий</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="text-blue-400 font-semibold mb-2">💡 Рекомендации</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Оптимизация маршрутов в Западном регионе</li>
              <li>• Увеличение курьеров в часы пик</li>
              <li>• Мониторинг погодных условий</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}