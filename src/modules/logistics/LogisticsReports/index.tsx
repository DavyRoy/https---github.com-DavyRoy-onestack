'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockReports: LogisticsReport[] = [
  {
    id: '1',
    period: '2024-01-15',
    type: 'daily',
    shipments: 58,
    deliveries: 54,
    returns: 2,
    damages: 1,
    onTimeRate: 0.93,
    averageDeliveryTime: 2.5,
    revenue: 145000,
    costs: 89000,
    profit: 56000,
    createdBy: 'Иван Сидоров',
    createdAt: '2024-01-15T18:00:00Z'
  }
];

function MetricsGrid({ report }: { report: LogisticsReport }) {
  const metrics: ReportMetric[] = [
    {
      label: 'Отгрузки',
      value: report.shipments,
      change: 12,
      format: 'number'
    },
    {
      label: 'Доставки',
      value: report.deliveries,
      change: 8,
      format: 'number'
    },
    {
      label: 'Вовремя',
      value: report.onTimeRate,
      change: 2,
      format: 'percentage'
    },
    {
      label: 'Среднее время',
      value: report.averageDeliveryTime,
      change: -0.3,
      format: 'time'
    },
    {
      label: 'Возвраты',
      value: report.returns,
      change: -1,
      format: 'number'
    },
    {
      label: 'Повреждения',
      value: report.damages,
      change: 0,
      format: 'number'
    },
    {
      label: 'Выручка',
      value: report.revenue,
      change: 15,
      format: 'currency'
    },
    {
      label: 'Прибыль',
      value: report.profit,
      change: 18,
      format: 'currency'
    }
  ];

  const formatValue = (metric: ReportMetric) => {
    switch (metric.format) {
      case 'currency':
        return `${metric.value.toLocaleString('ru-RU')} ₽`;
      case 'percentage':
        return `${(metric.value * 100).toFixed(1)}%`;
      case 'time':
        return `${metric.value} ч`;
      default:
        return metric.value.toLocaleString('ru-RU');
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatValue(metric)}
          </div>
          <div className={`text-xs ${
            metric.change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Delivery Performance */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Эффективность доставки</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Вовремя</span>
            <div className="flex items-center gap-2">
              <span className="text-white">93%</span>
              <span className="text-green-400 text-sm">↑ 2%</span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '93%' }} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">С опозданием</span>
            <div className="flex items-center gap-2">
              <span className="text-white">5%</span>
              <span className="text-red-400 text-sm">↓ 1%</span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }} />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Отменены</span>
            <div className="flex items-center gap-2">
              <span className="text-white">2%</span>
              <span className="text-red-400 text-sm">↑ 0.5%</span>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }} />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Финансовые показатели</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Выручка</span>
            <span className="text-green-400">145 000 ₽</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Расходы</span>
            <span className="text-red-400">89 000 ₽</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Прибыль</span>
            <span className="text-blue-400">56 000 ₽</span>
          </div>
          
          <div className="pt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Рентабельность</span>
              <span>38.6%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38.6%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsList({ reports, onReportSelect }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">История отчётов</h3>
        <button className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
          + Новый
        </button>
      </div>
      
      <div className="space-y-3">
        {reports.map((report: LogisticsReport) => (
          <div
            key={report.id}
            onClick={() => onReportSelect(report)}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">
                  Отчёт за {new Date(report.period).toLocaleDateString('ru-RU')}
                </div>
                <div className="text-sm text-gray-400">
                  {report.type === 'daily' && 'Ежедневный'}
                  {report.type === 'weekly' && 'Еженедельный'}
                  {report.type === 'monthly' && 'Ежемесячный'}
                  • {report.createdBy}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{report.shipments} отгрузок</div>
                <div className="text-sm text-green-400">
                  {report.profit.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogisticsReports() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);
  const [period, setPeriod] = useState('today');
  const [reportType, setReportType] = useState('overview');

  const exportOptions = [
    { label: 'PDF', icon: '📄' },
    { label: 'Excel', icon: '📊' },
    { label: 'CSV', icon: '📋' },
    { label: 'Печать', icon: '🖨️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Отчёты по логистике</h1>
          <p className="text-gray-400 mt-2">Анализ эффективности и ключевые метрики доставки</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            <option value="today">Сегодня</option>
            <option value="yesterday">Вчера</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="custom">Произвольный период</option>
          </select>
          
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
          >
            <option value="overview">Обзор</option>
            <option value="delivery">Доставка</option>
            <option value="financial">Финансы</option>
            <option value="inventory">Склад</option>
            <option value="customers">Клиенты</option>
          </select>
        </div>
      </div>

      {/* Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <div className="text-sm text-gray-400">
          Отчёт за {new Date(selectedReport.period).toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        <div className="flex gap-2">
          {exportOptions.map(option => (
            <button
              key={option.label}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MetricsGrid report={selectedReport} />
          <ChartsSection />
        </div>
        
        <div className="space-y-6">
          <ReportsList 
            reports={mockReports} 
            onReportSelect={setSelectedReport}
          />
          
          {/* Quick Insights */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Рекомендации</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="font-medium text-white text-sm">Увеличить количество курьеров</div>
                <div className="text-xs text-gray-400 mt-1">Пиковая нагрузка в 14:00-16:00</div>
              </div>
              
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="font-medium text-white text-sm">Снижение времени доставки</div>
                <div className="text-xs text-gray-400 mt-1">На 12% за последнюю неделю</div>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="font-medium text-white text-sm">Оптимизация маршрутов</div>
                <div className="text-xs text-gray-400 mt-1">Возможна экономия 15% топлива</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}