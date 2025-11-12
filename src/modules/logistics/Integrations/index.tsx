'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: '1C:Предприятие',
    type: '1c',
    status: 'connected',
    lastSync: '2024-01-15T16:30:00Z',
    syncStatus: 'success',
    recordsProcessed: 145,
    errors: [],
    settings: {
      url: 'https://1c.company.com/ws/odata',
      frequency: 'realtime',
      autoSync: true
    }
  },
  {
    id: '2',
    name: 'ERP System Pro',
    type: 'erp',
    status: 'connected',
    lastSync: '2024-01-15T15:45:00Z',
    syncStatus: 'warning',
    recordsProcessed: 89,
    errors: ['3 записи не обработаны'],
    settings: {
      url: 'https://erp.company.com/api/v2',
      frequency: 'hourly',
      autoSync: true
    }
  },
  {
    id: '3',
    name: 'Wildberries API',
    type: 'marketplace',
    status: 'error',
    lastSync: '2024-01-15T14:20:00Z',
    syncStatus: 'error',
    recordsProcessed: 0,
    errors: ['Ошибка аутентификации', 'Превышен лимит запросов'],
    settings: {
      url: 'https://supplier-api.wildberries.ru',
      frequency: 'hourly',
      autoSync: false
    }
  }
];

const syncLogs: SyncLog[] = [
  {
    id: '1',
    integrationId: '1',
    timestamp: '2024-01-15T16:30:00Z',
    status: 'success',
    recordsProcessed: 145,
    duration: 45
  },
  {
    id: '2',
    integrationId: '2',
    timestamp: '2024-01-15T15:45:00Z',
    status: 'warning',
    recordsProcessed: 89,
    duration: 32,
    error: '3 записи не обработаны'
  },
  {
    id: '3',
    integrationId: '3',
    timestamp: '2024-01-15T14:20:00Z',
    status: 'error',
    recordsProcessed: 0,
    duration: 12,
    error: 'Ошибка аутентификации'
  }
];

function IntegrationCard({ integration, onSync, onConfigure }: { 
  integration: Integration; 
  onSync: (id: string) => void;
  onConfigure: (integration: Integration) => void;
}) {
  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-gray-400';
      case 'error': return 'text-red-400';
      case 'syncing': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return '🔗';
      case 'disconnected': return '🔌';
      case 'error': return '❌';
      case 'syncing': return '🔄';
      default: return '⚙️';
    }
  };

  const getSyncStatusColor = (status: Integration['syncStatus']) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {integration.type === '1c' && '1️⃣'}
            {integration.type === 'erp' && '📊'}
            {integration.type === 'crm' && '👥'}
            {integration.type === 'marketplace' && '🛒'}
            {integration.type === 'custom' && '🔧'}
          </div>
          <div>
            <div className="font-semibold text-white">{integration.name}</div>
            <div className={`text-sm ${getStatusColor(integration.status)}`}>
              {getStatusIcon(integration.status)} 
              {integration.status === 'connected' && 'Подключено'}
              {integration.status === 'disconnected' && 'Отключено'}
              {integration.status === 'error' && 'Ошибка'}
              {integration.status === 'syncing' && 'Синхронизация'}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">Последняя синхронизация</div>
          <div className="text-white text-sm">
            {new Date(integration.lastSync).toLocaleString('ru-RU')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400">Статус синхронизации</div>
          <div className={`text-sm ${getSyncStatusColor(integration.syncStatus)}`}>
            {integration.syncStatus === 'success' && 'Успешно'}
            {integration.syncStatus === 'warning' && 'Предупреждение'}
            {integration.syncStatus === 'error' && 'Ошибка'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Обработано записей</div>
          <div className="text-white text-sm">{integration.recordsProcessed}</div>
        </div>
      </div>

      {integration.errors.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="text-red-400 text-sm font-medium mb-1">Ошибки:</div>
          <ul className="text-red-300 text-sm space-y-1">
            {integration.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onSync(integration.id)}
          disabled={integration.status === 'syncing'}
          className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-white"
        >
          {integration.status === 'syncing' ? 'Синхронизация...' : 'Синхронизировать'}
        </button>
        <button
          onClick={() => onConfigure(integration)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}

function SyncLogs() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Журнал синхронизации</h3>
      
      <div className="space-y-3">
        {syncLogs.map(log => (
          <div key={log.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`
                  w-2 h-2 rounded-full
                  ${log.status === 'success' ? 'bg-green-500' : ''}
                  ${log.status === 'warning' ? 'bg-yellow-500' : ''}
                  ${log.status === 'error' ? 'bg-red-500' : ''}
                `} />
                <div className="font-semibold text-white">
                  {mockIntegrations.find(i => i.id === log.integrationId)?.name}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(log.timestamp).toLocaleString('ru-RU')}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Статус</div>
                <div className={`
                  ${log.status === 'success' ? 'text-green-400' : ''}
                  ${log.status === 'warning' ? 'text-yellow-400' : ''}
                  ${log.status === 'error' ? 'text-red-400' : ''}
                `}>
                  {log.status === 'success' && 'Успешно'}
                  {log.status === 'warning' && 'Предупреждение'}
                  {log.status === 'error' && 'Ошибка'}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Записей</div>
                <div className="text-white">{log.recordsProcessed}</div>
              </div>
              <div>
                <div className="text-gray-400">Время</div>
                <div className="text-white">{log.duration} сек</div>
              </div>
            </div>
            
            {log.error && (
              <div className="mt-2 text-sm text-red-400">
                Ошибка: {log.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationSettings({ integration, onClose }: { 
  integration: Integration; 
  onClose: () => void;
}) {
  const [settings, setSettings] = useState(integration.settings);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Настройки {integration.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">URL API</label>
            <input
              type="url"
              value={settings.url}
              onChange={(e) => setSettings(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">API Key</label>
            <input
              type="password"
              value="••••••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Частота синхронизации</label>
            <select
              value={settings.frequency}
              onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              <option value="realtime">В реальном времени</option>
              <option value="hourly">Каждый час</option>
              <option value="daily">Ежедневно</option>
              <option value="manual">Вручную</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white">Автоматическая синхронизация</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={(e) => setSettings(prev => ({ ...prev, autoSync: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => {
                // Сохранение настроек
                alert('Настройки сохранены!');
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Integrations() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSync = (id: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id 
        ? { ...integration, status: 'syncing' as const }
        : integration
    ));

    // Симуляция синхронизации
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration =>
        integration.id === id 
          ? { 
              ...integration, 
              status: 'connected' as const,
              lastSync: new Date().toISOString(),
              syncStatus: 'success' as const,
              recordsProcessed: integration.recordsProcessed + Math.floor(Math.random() * 50) + 10
            }
          : integration
      ));
    }, 2000);
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowSettings(true);
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const errorCount = integrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">API-интеграции</h1>
          <p className="text-gray-400 mt-2">Подключение и управление внешними системами</p>
        </div>
        
        <button className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white">
          + Новая интеграция
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{integrations.length}</div>
          <div className="text-sm text-gray-400">Всего интеграций</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{connectedCount}</div>
          <div className="text-sm text-gray-400">Активные</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-red-400">{errorCount}</div>
          <div className="text-sm text-gray-400">С ошибками</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-blue-400">
            {integrations.reduce((acc, i) => acc + i.recordsProcessed, 0)}
          </div>
          <div className="text-sm text-gray-400">Всего записей</div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onSync={handleSync}
            onConfigure={handleConfigure}
          />
        ))}
      </div>

      {/* Sync Logs */}
      <SyncLogs />

      {/* Settings Modal */}
      {showSettings && selectedIntegration && (
        <IntegrationSettings
          integration={selectedIntegration}
          onClose={() => {
            setShowSettings(false);
            setSelectedIntegration(null);
          }}
        />
      )}
    </div>
  );
}