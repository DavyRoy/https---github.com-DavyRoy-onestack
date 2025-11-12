// /src/app/demo/medicine/owner/modules/reports/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Типы данных
interface ReportMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface ReportData {
  title: string;
  description: string;
  icon: string;
  color: string;
  metrics: ReportMetric[];
  charts: string[];
  lastGenerated?: string;
  frequency?: string;
  dataPoints: number;
}

interface QuickReport {
  title: string;
  description: string;
  icon: string;
  time: string;
  records: string;
  type: string;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock данные для отчетов
  const reportsData = useMemo((): Record<string, ReportData> => ({
    financial: {
      title: 'Финансовый отчет',
      description: 'Доходы, расходы и прибыль клиники',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      lastGenerated: '2024-01-24',
      frequency: 'ежедневно',
      dataPoints: 2456,
      metrics: [
        { label: 'Общая выручка', value: '1,245,800 ₽', change: '+12.5%', trend: 'up' },
        { label: 'Чистая прибыль', value: '348,200 ₽', change: '+8.3%', trend: 'up' },
        { label: 'Операционные расходы', value: '897,600 ₽', change: '+5.2%', trend: 'up' },
        { label: 'Рентабельность', value: '23.7%', change: '+2.1%', trend: 'up' }
      ],
      charts: ['Динамика доходов', 'Структура расходов', 'Прибыль по отделениям', 'Cash Flow']
    },
    patients: {
      title: 'Отчет по пациентам',
      description: 'Статистика пациентов и посещений',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500',
      lastGenerated: '2024-01-23',
      frequency: 'еженедельно',
      dataPoints: 1842,
      metrics: [
        { label: 'Новые пациенты', value: '156', change: '+8.2%', trend: 'up' },
        { label: 'Всего посещений', value: '1,842', change: '+15.7%', trend: 'up' },
        { label: 'Средний чек', value: '2,845 ₽', change: '+3.4%', trend: 'up' },
        { label: 'Удержание пациентов', value: '78.3%', change: '+4.1%', trend: 'up' }
      ],
      charts: ['Динамика новых пациентов', 'География пациентов', 'Возрастная структура', 'Лояльность']
    },
    staff: {
      title: 'Отчет по персоналу',
      description: 'Эффективность врачей и сотрудников',
      icon: '👨‍⚕️',
      color: 'from-purple-500 to-indigo-500',
      lastGenerated: '2024-01-22',
      frequency: 'еженедельно',
      dataPoints: 2156,
      metrics: [
        { label: 'Загрузка врачей', value: '84.2%', change: '+5.1%', trend: 'up' },
        { label: 'Средняя оценка', value: '4.8/5', change: '+0.2', trend: 'up' },
        { label: 'Количество приемов', value: '2,156', change: '+12.3%', trend: 'up' },
        { label: 'Эффективность', value: '89.7%', change: '+3.8%', trend: 'up' }
      ],
      charts: ['Загрузка по врачам', 'Рейтинги специалистов', 'Распределение нагрузки', 'KPI']
    },
    departments: {
      title: 'Отчет по отделениям',
      description: 'Эффективность медицинских отделений',
      icon: '🏥',
      color: 'from-orange-500 to-red-500',
      lastGenerated: '2024-01-21',
      frequency: 'ежемесячно',
      dataPoints: 842,
      metrics: [
        { label: 'Терапия - доход', value: '456,200 ₽', change: '+10.2%', trend: 'up' },
        { label: 'Кардиология - доход', value: '389,100 ₽', change: '+15.7%', trend: 'up' },
        { label: 'Неврология - доход', value: '284,500 ₽', change: '+8.9%', trend: 'up' },
        { label: 'Хирургия - доход', value: '116,000 ₽', change: '+6.3%', trend: 'up' }
      ],
      charts: ['Доходы по отделениям', 'Загрузка кабинетов', 'Эффективность отделений', 'ROI']
    },
    medical: {
      title: 'Медицинская статистика',
      description: 'Анализ заболеваний и лечения',
      icon: '🏥',
      color: 'from-teal-500 to-cyan-500',
      lastGenerated: '2024-01-20',
      frequency: 'ежемесячно',
      dataPoints: 3245,
      metrics: [
        { label: 'Распространенные диагнозы', value: '24', change: '+2.1%', trend: 'up' },
        { label: 'Среднее время лечения', value: '14.2 дн', change: '-1.3%', trend: 'down' },
        { label: 'Эффективность лечения', value: '92.4%', change: '+0.8%', trend: 'up' },
        { label: 'Рецидивы', value: '3.2%', change: '-0.4%', trend: 'down' }
      ],
      charts: ['Топ диагнозы', 'Эффективность терапий', 'Статистика выздоровлений', 'Анализ рецидивов']
    },
    equipment: {
      title: 'Отчет по оборудованию',
      description: 'Использование и обслуживание аппаратуры',
      icon: '🔧',
      color: 'from-yellow-500 to-amber-500',
      lastGenerated: '2024-01-19',
      frequency: 'ежеквартально',
      dataPoints: 568,
      metrics: [
        { label: 'Загрузка оборудования', value: '76.8%', change: '+4.2%', trend: 'up' },
        { label: 'Время простоя', value: '3.2%', change: '-1.1%', trend: 'down' },
        { label: 'Стоимость обслуживания', value: '124,500 ₽', change: '+5.7%', trend: 'up' },
        { label: 'Эффективность использования', value: '88.3%', change: '+2.4%', trend: 'up' }
      ],
      charts: ['Загрузка аппаратуры', 'График ТО', 'Стоимость обслуживания', 'Амортизация']
    }
  }), []);

  // Mock данные для быстрых отчетов
  const quickReports: QuickReport[] = useMemo(() => [
    {
      title: 'Ежедневная сводка',
      description: 'Ключевые показатели за сегодня',
      icon: '📊',
      time: '2 мин',
      records: '24 записи',
      type: 'financial'
    },
    {
      title: 'Недельный финансовый отчет',
      description: 'Доходы и расходы за неделю',
      icon: '💰',
      time: '5 мин',
      records: '156 транзакций',
      type: 'financial'
    },
    {
      title: 'Месячная статистика пациентов',
      description: 'Анализ пациентского потока',
      icon: '👥',
      time: '3 мин',
      records: '842 посещения',
      type: 'patients'
    },
    {
      title: 'Квартальная аналитика',
      description: 'Полный бизнес-анализ',
      icon: '📈',
      time: '15 мин',
      records: '2,845 записей',
      type: 'comprehensive'
    }
  ], []);

  const recentReports = [
    { name: 'Финансовый отчет за январь', date: '2 часа назад', type: '💰', size: '2.4 MB' },
    { name: 'Статистика пациентов за неделю', date: 'Вчера', type: '👥', size: '1.8 MB' },
    { name: 'Анализ эффективности персонала', date: '3 дня назад', type: '📈', size: '3.1 MB' },
    { name: 'Отчет по медицинскому оборудованию', date: 'Неделя назад', type: '🔧', size: '4.2 MB' }
  ];

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(reportType);
    // Имитация генерации отчета
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Generated ${reportType} report for ${dateRange} in ${exportFormat} format`);
    setIsGenerating(null);
  };

  const handleQuickReport = async (report: QuickReport) => {
    setIsGenerating(report.type);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Quick generated: ${report.title}`);
    setIsGenerating(null);
  };

  const formatDate = (dateString: string) => {
    if (!isClient) return dateString;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-4 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl lg:text-3xl">
                📋
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-3xl font-bold text-white mb-1 lg:mb-2 truncate">
                  Отчетность и аналитика
                </h1>
                <p className="text-white/60 text-sm lg:text-base truncate">
                  Автоматические отчеты и бизнес-аналитика клиники
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/demo/medicine/owner"
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 text-sm font-medium text-white flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Назад</span>
              </Link>
            </div>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 p-4 lg:p-6 bg-white/5 rounded-xl lg:rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center lg:gap-6">
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm whitespace-nowrap">Период:</span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="today">Сегодня</option>
                  <option value="week">Неделя</option>
                  <option value="month">Месяц</option>
                  <option value="quarter">Квартал</option>
                  <option value="year">Год</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-sm whitespace-nowrap">Формат:</span>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>Обновить все данные</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Quick Reports */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
                  <span>⚡</span>
                  Быстрые отчеты
                </h2>
                <span className="text-white/60 text-sm">Автогенерация</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                {quickReports.map((report, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickReport(report)}
                    disabled={isGenerating === report.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-lg lg:text-xl group-hover:scale-110 transition-transform duration-200">
                        {report.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm lg:text-base truncate">
                          {report.title}
                        </h3>
                        <p className="text-white/60 text-xs lg:text-sm truncate">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{report.time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📊</span>
                        <span>{report.records}</span>
                      </span>
                    </div>
                    {isGenerating === report.type && (
                      <div className="mt-2 flex items-center gap-2 text-green-400 text-xs">
                        <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                        Генерация...
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* Detailed Reports */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-xl font-semibold text-white flex items-center gap-2">
                  <span>📈</span>
                  Детальные отчеты
                </h2>
                <span className="text-white/60 text-sm">{Object.keys(reportsData).length} отчетов</span>
              </div>
              <div className="space-y-4">
                {Object.entries(reportsData).map(([key, report]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * parseInt(key) }}
                    className="p-4 lg:p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                    onClick={() => setSelectedReport(selectedReport === key ? null : key)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center text-xl shadow-lg flex-shrink-0`}>
                          {report.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-lg truncate">
                            {report.title}
                          </h3>
                          <p className="text-white/60 text-sm truncate mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-white/40">
                            <span>📅 {formatDate(report.lastGenerated!)}</span>
                            <span>🔄 {report.frequency}</span>
                            <span>📊 {report.dataPoints} записей</span>
                          </div>
                        </div>
                      </div>
                      <motion.span
                        animate={{ rotate: selectedReport === key ? 180 : 0 }}
                        className="text-white/40 text-xl group-hover:text-white transition-colors mt-2"
                      >
                        ↓
                      </motion.span>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      {report.metrics.map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                        >
                          <div className="text-white/60 text-xs mb-1">{metric.label}</div>
                          <div className="text-white font-bold text-sm lg:text-base mb-1">
                            {metric.value}
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs">
                            <span className={metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'}>
                              {getTrendIcon(metric.trend)}
                            </span>
                            <span className={metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-yellow-400'}>
                              {metric.change}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {selectedReport === key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-white/10">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                  <span>📊</span>
                                  Доступные графики и аналитика:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {report.charts.map((chart, index) => (
                                    <motion.span
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="px-3 py-2 rounded-lg bg-white/5 text-white/80 text-sm border border-white/10 hover:bg-white/10 transition-all duration-200"
                                    >
                                      {chart}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGenerateReport(key);
                                  }}
                                  disabled={isGenerating === key}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isGenerating === key ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      <span>Генерация...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>📄</span>
                                      <span>Сгенерировать</span>
                                    </>
                                  )}
                                </motion.button>
                                <motion.button
                                  onClick={(e) => e.stopPropagation()}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                  <span>📤</span>
                                  <span>Экспорт</span>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Report Actions */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span>🚀</span>
                Действия с отчетами
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '📅', label: 'Запланировать отчет', description: 'Автоматическая генерация' },
                  { icon: '🔄', label: 'Обновить данные', description: 'Актуальная информация' },
                  { icon: '📧', label: 'Отправить по email', description: 'Рассылка отчетов' },
                  { icon: '⚙️', label: 'Настройки шаблонов', description: 'Кастомизация отчетов' }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 flex items-center gap-3 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      {action.icon}
                    </span>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{action.label}</div>
                      <div className="text-white/60 text-xs">{action.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* Recent Reports */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span>🕒</span>
                  Недавние отчеты
                </h3>
                <span className="text-white/60 text-sm">{recentReports.length} файлов</span>
              </div>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  >
                    <span className="text-lg">{report.type}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {report.name}
                      </div>
                      <div className="text-white/60 text-xs flex items-center gap-2">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                    <motion.span
                      whileHover={{ x: 2 }}
                      className="text-white/40 group-hover:text-white transition-colors"
                    >
                      →
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Statistics */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl lg:rounded-2xl p-4 lg:p-6 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <span>📊</span>
                Статистика отчетов
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Сгенерировано за месяц', value: '24', color: 'text-purple-400' },
                  { label: 'Автоматических отчетов', value: '8', color: 'text-purple-400' },
                  { label: 'Экспортировано файлов', value: '156', color: 'text-purple-400' },
                  { label: 'Экономия времени', value: '84%', color: 'text-green-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <span className="text-purple-300/80 text-sm">{stat.label}</span>
                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}