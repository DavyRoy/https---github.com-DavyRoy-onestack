'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DemoBreadcrumbs from '@/components/demo/DemoBreadcrumbs';
import {
  systemMetrics,
  securityAlerts,
  performanceData,
  backupStatus,
  userActivities,
  systemConfig,
  SecurityAlert
} from './demo-data';

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'performance' | 'backup' | 'config'>('overview');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [autoBackup, setAutoBackup] = useState(systemConfig.autoBackup);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'running': return 'text-yellow-400';
      default: return 'text-white/60';
    }
  };

  const formatFileSize = (size: number) => {
    return `${size} GB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}м ${secs}с`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <DemoBreadcrumbs 
          items={[
            { label: 'Демо', href: '/demo' },
            { label: 'Медицина', href: '/demo/medicine' },
            { label: 'Владелец', href: '/demo/medicine/owner' },
            { label: 'Панель администратора', href: '#' }
          ]} 
        />
        
        <div className="flex items-center justify-between mt-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Панель администратора</h1>
            <p className="text-white/60">Мониторинг системы, безопасность и управление настройками</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium">
              📊 Экспорт отчёта
            </button>
            <Link
              href="/demo/medicine/owner"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm font-medium"
            >
              ← Назад к дашборду
            </Link>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Аптайм</span>
            <span className="text-2xl">🟢</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{systemMetrics.uptime}%</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Время ответа</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{systemMetrics.responseTime}мс</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Активные пользователи</span>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemMetrics.activeUsers}</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Нагрузка сервера</span>
            <span className="text-2xl">📊</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{systemMetrics.serverLoad}%</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Размер БД</span>
            <span className="text-2xl">💾</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{systemMetrics.databaseSize} GB</div>
        </div>
        
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Последний бэкап</span>
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="text-lg font-bold text-white">
            {new Date(systemMetrics.lastBackup).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-6">
        {[
          { value: 'overview', label: 'Обзор', icon: '📊' },
          { value: 'security', label: 'Безопасность', icon: '🛡️' },
          { value: 'performance', label: 'Производительность', icon: '⚡' },
          { value: 'backup', label: 'Резервные копии', icon: '💾' },
          { value: 'config', label: 'Настройки', icon: '⚙️' }
        ].map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === value
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Alerts */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Последние оповещения безопасности</h3>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-sm">
                {securityAlerts.filter(a => !a.resolved).length} активных
              </span>
            </div>
            <div className="space-y-3">
              {securityAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-white font-medium text-sm">{alert.title}</span>
                    </div>
                    {!alert.resolved && (
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-white/60 text-sm mb-1">{alert.description}</div>
                  <div className="text-white/40 text-xs">
                    {new Date(alert.timestamp).toLocaleString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">Активность пользователей</h3>
            <div className="space-y-3">
              {userActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div>
                    <div className="text-white font-medium text-sm">{activity.user}</div>
                    <div className="text-white/60 text-xs">
                      {activity.action} • {activity.resource}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-xs">
                      {new Date(activity.timestamp).toLocaleTimeString('ru-RU')}
                    </div>
                    <div className="text-white/40 text-xs">{activity.ip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="font-semibold text-white">Оповещения безопасности</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Тип</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Важность</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Описание</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Время</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Статус</th>
                    <th className="text-left p-4 text-white/60 text-sm font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {securityAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="text-white font-medium text-sm">{alert.type}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-white/80 text-sm">{alert.description}</div>
                      </td>
                      <td className="p-4 text-white/60 text-sm">
                        {new Date(alert.timestamp).toLocaleString('ru-RU')}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.resolved 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {alert.resolved ? 'Решено' : 'Активно'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 text-xs transition-colors">
                          Детали
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">Производительность системы</h3>
            <div className="space-y-4">
              {performanceData.map((metric) => (
                <div key={metric.time} className="flex items-center justify-between">
                  <div className="text-white/60 w-16">{metric.time}</div>
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-white font-medium">{metric.appointments}</div>
                      <div className="text-white/60 text-xs">Приёмы</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{metric.revenue.toLocaleString()}</div>
                      <div className="text-white/60 text-xs">Выручка</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{metric.patients}</div>
                      <div className="text-white/60 text-xs">Пациенты</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{metric.load}%</div>
                      <div className="text-white/60 text-xs">Нагрузка</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">Статус резервных копий</h3>
            <div className="space-y-3">
              {backupStatus.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      backup.status === 'success' ? 'bg-green-500/20 text-green-400' :
                      backup.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {backup.status === 'success' ? '✅' :
                       backup.status === 'failed' ? '❌' : '⏳'}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {backup.type === 'full' ? 'Полная копия' : 'Инкрементальная'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {new Date(backup.timestamp).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getStatusColor(backup.status)}`}>
                      {backup.status === 'success' ? 'Успешно' :
                       backup.status === 'failed' ? 'Ошибка' : 'В процессе'}
                    </div>
                    <div className="text-white/60 text-sm">
                      {formatFileSize(backup.size)} • {formatDuration(backup.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">Настройки системы</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Автоматическое резервное копирование</div>
                  <div className="text-white/60 text-sm">Ежедневное создание резервных копий</div>
                </div>
                <button
                  onClick={() => setAutoBackup(!autoBackup)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoBackup ? 'bg-green-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autoBackup ? 'transform translate-x-7' : 'transform translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Время резервного копирования</label>
                <input
                  type="time"
                  value={systemConfig.backupTime}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Таймаут сессии (минуты)</label>
                <input
                  type="number"
                  value={systemConfig.sessionTimeout}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Максимум попыток входа</label>
                <input
                  type="number"
                  value={systemConfig.maxLoginAttempts}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">Информация о системе</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Название клиники:</span>
                <span className="text-white">{systemConfig.clinicName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Часовой пояс:</span>
                <span className="text-white">{systemConfig.timezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Язык:</span>
                <span className="text-white">{systemConfig.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Формат даты:</span>
                <span className="text-white">{systemConfig.dateFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Политика паролей:</span>
                <span className="text-white capitalize">{systemConfig.passwordPolicy}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Детали оповещения</h2>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                  selectedAlert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  selectedAlert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  selectedAlert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  🛡️
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{selectedAlert.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity}
                    </span>
                    <span className="text-white/60 text-sm">
                      {new Date(selectedAlert.timestamp).toLocaleString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-white/60 text-sm mb-2">Описание:</div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-white/80">{selectedAlert.description}</div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors font-medium">
                  Пометить как решённое
                </button>
                <button className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium text-white">
                  Создать задачу
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}