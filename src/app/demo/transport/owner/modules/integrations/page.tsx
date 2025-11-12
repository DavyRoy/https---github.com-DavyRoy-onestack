'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Integration {
  id: string;
  name: string;
  provider: string;
  type: 'schedule' | 'payment' | 'gps' | 'government';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  nextSync: string;
  successRate: number;
  description: string;
}

interface SyncLog {
  id: string;
  integration: string;
  status: 'success' | 'error' | 'warning';
  timestamp: string;
  duration: string;
  records: number;
  message: string;
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'logs' | 'settings'>('integrations');

  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Гос-портал расписаний',
      provider: 'Минтранс РФ',
      type: 'government',
      status: 'active',
      lastSync: '2024-01-15T06:00:00Z',
      nextSync: '2024-01-16T06:00:00Z',
      successRate: 98,
      description: 'Автоматическая синхронизация расписаний с государственным порталом'
    },
    {
      id: '2',
      name: 'GTFS импорт',
      provider: 'Open Transit',
      type: 'schedule',
      status: 'active',
      lastSync: '2024-01-15T05:30:00Z',
      nextSync: '2024-01-16T05:30:00Z',
      successRate: 95,
      description: 'Импорт данных в формате GTFS из внешних источников'
    },
    {
      id: '3',
      name: 'Платёжный шлюз',
      provider: 'CloudPayments',
      type: 'payment',
      status: 'active',
      lastSync: '2024-01-15T10:15:00Z',
      nextSync: '2024-01-15T10:30:00Z',
      successRate: 99,
      description: 'Интеграция с платёжной системой для онлайн-оплат'
    },
    {
      id: '4',
      name: 'GPS трекеры',
      provider: 'Wialon',
      type: 'gps',
      status: 'error',
      lastSync: '2024-01-15T09:45:00Z',
      nextSync: '2024-01-15T10:00:00Z',
      successRate: 85,
      description: 'Получение данных GPS с транспортных средств'
    }
  ];

  const syncLogs: SyncLog[] = [
    {
      id: '1',
      integration: 'Гос-портал расписаний',
      status: 'success',
      timestamp: '2024-01-15T06:00:00Z',
      duration: '2m 15s',
      records: 156,
      message: 'Успешная синхронизация расписаний'
    },
    {
      id: '2',
      integration: 'GPS трекеры',
      status: 'error',
      timestamp: '2024-01-15T09:45:00Z',
      duration: '0m 45s',
      records: 0,
      message: 'Ошибка подключения к серверу GPS'
    },
    {
      id: '3',
      integration: 'GTFS импорт',
      status: 'success',
      timestamp: '2024-01-15T05:30:00Z',
      duration: '3m 30s',
      records: 89,
      message: 'Импорт данных GTFS завершён'
    },
    {
      id: '4',
      integration: 'Платёжный шлюз',
      status: 'warning',
      timestamp: '2024-01-15T10:15:00Z',
      duration: '1m 10s',
      records: 234,
      message: 'Частичная синхронизация транзакций'
    }
  ];

  const stats = {
    active: integrations.filter(i => i.status === 'active').length,
    total: integrations.length,
    successRate: Math.round(integrations.reduce((sum, i) => sum + i.successRate, 0) / integrations.length),
    lastSync: integrations.reduce((latest, i) => 
      new Date(i.lastSync) > new Date(latest) ? i.lastSync : latest, '')
  };

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
              <span className="text-white font-medium">API-интеграции</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                Документация
              </button>
              <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm">
                + Новая интеграция
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
              <div className="text-2xl font-bold text-white mb-2">{stats.active}/{stats.total}</div>
              <div className="text-sm text-gray-400">Активных интеграций</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400 mb-2">{stats.successRate}%</div>
              <div className="text-sm text-gray-400">Успешных синхронизаций</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {syncLogs.filter(log => log.status === 'success').length}
              </div>
              <div className="text-sm text-gray-400">Синхронизаций сегодня</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {syncLogs.filter(log => log.status === 'error').length}
              </div>
              <div className="text-sm text-gray-400">Ошибок сегодня</div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-6">
          <div className="flex bg-white/5 rounded-xl p-1">
            {(['integrations', 'logs', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg transition-colors capitalize ${
                  activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-400'
                }`}
              >
                {tab === 'integrations' ? 'Интеграции' :
                 tab === 'logs' ? 'Логи' : 'Настройки'}
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'integrations' && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map(integration => (
                <div
                  key={integration.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        integration.type === 'government' ? 'bg-blue-500/20 border border-blue-500/30' :
                        integration.type === 'schedule' ? 'bg-green-500/20 border border-green-500/30' :
                        integration.type === 'payment' ? 'bg-purple-500/20 border border-purple-500/30' :
                        'bg-orange-500/20 border border-orange-500/30'
                      }`}>
                        {integration.type === 'government' ? '🏛️' :
                         integration.type === 'schedule' ? '📅' :
                         integration.type === 'payment' ? '💳' : '📍'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{integration.name}</h3>
                        <div className="text-sm text-gray-400">{integration.provider}</div>
                      </div>
                    </div>
                    
                    <div className={`w-3 h-3 rounded-full ${
                      integration.status === 'active' ? 'bg-green-500' :
                      integration.status === 'inactive' ? 'bg-gray-500' : 'bg-red-500'
                    }`} />
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{integration.description}</p>

                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Статус:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        integration.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        integration.status === 'inactive' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {integration.status === 'active' ? 'Активна' :
                         integration.status === 'inactive' ? 'Неактивна' : 'Ошибка'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Успешность:</span>
                      <span className={integration.successRate > 90 ? 'text-green-400' : 'text-yellow-400'}>
                        {integration.successRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Последняя синхронизация:</span>
                      <span>{new Date(integration.lastSync).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Следующая синхронизация:</span>
                      <span>{new Date(integration.nextSync).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                      {integration.status === 'active' ? 'Остановить' : 'Запустить'}
                    </button>
                    <button className="flex-1 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors text-sm text-blue-400">
                      Настроить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'logs' && (
          <section>
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold">Логи синхронизации</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Интеграция</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Статус</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Время</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Длительность</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Записи</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Сообщение</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {syncLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-sm">{log.integration}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            log.status === 'success' ? 'bg-green-500/20 text-green-400' :
                            log.status === 'error' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {log.status === 'success' ? 'Успешно' :
                             log.status === 'error' ? 'Ошибка' : 'Предупреждение'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-400">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">{log.duration}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">{log.records}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-400 max-w-xs truncate">{log.message}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* API Settings */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Настройки API</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Base URL</label>
                    <input
                      type="text"
                      defaultValue="https://api.transport.demo/v1"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                    <input
                      type="password"
                      defaultValue="••••••••••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Таймаут запросов</label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Sync Settings */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Настройки синхронизации</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Автоматическая синхронизация', enabled: true },
                    { name: 'Ретри при ошибках', enabled: true },
                    { name: 'Подробное логирование', enabled: false },
                    { name: 'Уведомления об ошибках', enabled: true }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{setting.name}</span>
                      <button className={`w-12 h-6 rounded-full transition-colors ${
                        setting.enabled ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          setting.enabled ? 'transform translate-x-7' : 'transform translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}