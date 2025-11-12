'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Report {
  id: string;
  name: string;
  type: 'financial' | 'operational' | 'analytical' | 'custom';
  description: string;
  schedule: 'daily' | 'weekly' | 'monthly' | 'manual';
  lastGenerated: string;
  nextGeneration: string;
  format: 'excel' | 'pdf' | 'csv';
  size: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: string[];
  isCustom: boolean;
}

export default function ReportsExportPage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'scheduled'>('reports');
  const [selectedReport, setSelectedReport] = useState<string>('');

  const reports: Report[] = [
    {
      id: '1',
      name: 'Финансовый отчёт за день',
      type: 'financial',
      description: 'Ежедневный отчёт по продажам и выручке',
      schedule: 'daily',
      lastGenerated: '2024-01-15T08:00:00Z',
      nextGeneration: '2024-01-16T08:00:00Z',
      format: 'excel',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Операционная статистика',
      type: 'operational',
      description: 'Статистика по рейсам, задержкам и отменам',
      schedule: 'weekly',
      lastGenerated: '2024-01-14T09:00:00Z',
      nextGeneration: '2024-01-21T09:00:00Z',
      format: 'pdf',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Аналитика пассажиропотока',
      type: 'analytical',
      description: 'Детальный анализ пассажиропотока по маршрутам',
      schedule: 'monthly',
      lastGenerated: '2024-01-01T10:00:00Z',
      nextGeneration: '2024-02-01T10:00:00Z',
      format: 'excel',
      size: '5.2 MB'
    }
  ];

  const templates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Стандартный финансовый отчёт',
      category: 'Финансы',
      description: 'Баланс, выручка, расходы по дням',
      fields: ['Дата', 'Выручка', 'Продажи', 'Возвраты', 'Чистая прибыль'],
      isCustom: false
    },
    {
      id: '2',
      name: 'Операционный дашборд',
      category: 'Операции',
      description: 'Ключевые операционные показатели',
      fields: ['Рейсы', 'Задержки', 'Отмены', 'Заполняемость', 'Пассажиры'],
      isCustom: false
    },
    {
      id: '3',
      name: 'Кастомный анализ маршрутов',
      category: 'Аналитика',
      description: 'Пользовательский анализ эффективности маршрутов',
      fields: ['Маршрут', 'Доходность', 'Загрузка', 'Рентабельность'],
      isCustom: true
    }
  ];

  const recentExports = [
    { id: '1', name: 'financial_report_2024-01-15.xlsx', date: '2024-01-15T08:00:00Z', size: '2.4 MB' },
    { id: '2', name: 'operations_weekly_2024-01-14.pdf', date: '2024-01-14T09:00:00Z', size: '1.8 MB' },
    { id: '3', name: 'passengers_daily_2024-01-15.csv', date: '2024-01-15T07:30:00Z', size: '0.9 MB' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo/transport/owner" className="text-gray-400 hover:text-white transition-colors">
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Отчётность и экспорт</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                Настройки
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm">
                + Создать отчёт
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-2">{reports.length}</div>
              <div className="text-sm text-gray-400">Активных отчётов</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400 mb-2">24</div>
              <div className="text-sm text-gray-400">Экспортов за месяц</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400 mb-2">156 MB</div>
              <div className="text-sm text-gray-400">Общий объём данных</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400 mb-2">3</div>
              <div className="text-sm text-gray-400">Запланированных задач</div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-6">
          <div className="flex bg-white/5 rounded-xl p-1">
            {(['reports', 'templates', 'scheduled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg transition-colors capitalize ${
                  activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-400'
                }`}
              >
                {tab === 'reports' ? 'Отчёты' :
                 tab === 'templates' ? 'Шаблоны' : 'По расписанию'}
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'reports' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reports List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {reports.map(report => (
                  <div
                    key={report.id}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          report.type === 'financial' ? 'bg-green-500/20 border border-green-500/30' :
                          report.type === 'operational' ? 'bg-blue-500/20 border border-blue-500/30' :
                          'bg-purple-500/20 border border-purple-500/30'
                        }`}>
                          {report.type === 'financial' ? '💰' :
                           report.type === 'operational' ? '📊' : '📈'}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-white mb-1">{report.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{report.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Формат:</span>
                              <span className="px-2 py-1 rounded-full bg-white/5 text-white/80">
                                {report.format.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Расписание:</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                report.schedule === 'daily' ? 'bg-green-500/20 text-green-400' :
                                report.schedule === 'weekly' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-purple-500/20 text-purple-400'
                              }`}>
                                {report.schedule === 'daily' ? 'Ежедневно' :
                                 report.schedule === 'weekly' ? 'Еженедельно' : 'Ежемесячно'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                          Экспорт
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-sm text-gray-400">
                        Последняя генерация: {new Date(report.lastGenerated).toLocaleString()}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                          Настроить
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors text-sm">
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Exports */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Последние экспорты</h3>
              <div className="space-y-3">
                {recentExports.map(exportItem => (
                  <div
                    key={exportItem.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm truncate">{exportItem.name}</div>
                      <span className="text-xs text-gray-400">{exportItem.size}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(exportItem.date).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-xs">
                        Скачать
                      </button>
                      <button className="flex-1 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-xs">
                        Поделиться
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'templates' && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        template.category === 'Финансы' ? 'bg-green-500/20 text-green-400' :
                        template.category === 'Операции' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {template.category}
                      </span>
                    </div>
                    
                    {template.isCustom && (
                      <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                        Кастомный
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-400">Поля отчёта:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.map((field, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full bg-white/5 text-white/80 text-xs"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                      Использовать
                    </button>
                    <button className="flex-1 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors text-sm text-blue-400">
                      Редактировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'scheduled' && (
          <section>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-6">Запланированные задачи экспорта</h3>
              
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        report.type === 'financial' ? 'bg-green-500/20 border border-green-500/30' :
                        report.type === 'operational' ? 'bg-blue-500/20 border border-blue-500/30' :
                        'bg-purple-500/20 border border-purple-500/30'
                      }`}>
                        {report.type === 'financial' ? '💰' :
                         report.type === 'operational' ? '📊' : '📈'}
                      </div>
                      
                      <div>
                        <div className="font-semibold text-white">{report.name}</div>
                        <div className="text-sm text-gray-400">
                          Следующая генерация: {new Date(report.nextGeneration).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                        Запустить сейчас
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-colors text-sm text-yellow-400">
                        Изменить расписание
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}