'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'delivery',
    title: 'Доставка завершена',
    message: 'Заказ ORD-001 успешно доставлен получателю',
    channel: 'push',
    status: 'sent',
    read: false,
    createdAt: '2024-01-15T15:30:00Z',
    actionUrl: '/demo/logistics/user/modules/delivery-tracking'
  },
  {
    id: '2',
    type: 'order',
    title: 'Новый заказ',
    message: 'Получен новый заказ ORD-002 от Ивана Петрова',
    channel: 'email',
    status: 'sent',
    read: true,
    createdAt: '2024-01-15T14:20:00Z'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Низкие остатки',
    message: 'Критически низкие остатки по SKU-002',
    channel: 'all',
    status: 'sent',
    read: false,
    createdAt: '2024-01-15T13:45:00Z'
  },
  {
    id: '4',
    type: 'system',
    title: 'Обновление системы',
    message: 'Запланировано техническое обслуживание на 16.01.2024 02:00-04:00',
    channel: 'email',
    status: 'sent',
    read: true,
    createdAt: '2024-01-15T12:00:00Z'
  }
];

const notificationTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Заказ создан',
    type: 'order',
    title: 'Новый заказ #{orderId}',
    message: 'Заказ #{orderId} создан и ожидает обработки. Клиент: #{customerName}',
    channels: ['email', 'push'],
    enabled: true,
    triggers: ['order_created']
  },
  {
    id: '2',
    name: 'Доставка завершена',
    type: 'delivery',
    title: 'Доставка завершена',
    message: 'Заказ #{orderId} успешно доставлен получателю в #{deliveryTime}',
    channels: ['push', 'sms'],
    enabled: true,
    triggers: ['delivery_completed']
  },
  {
    id: '3',
    name: 'Низкие остатки',
    type: 'alert',
    title: 'Низкие остатки #{sku}',
    message: 'Критически низкие остатки товара #{productName}. Текущий остаток: #{currentStock}',
    channels: ['email'],
    enabled: true,
    triggers: ['low_stock']
  }
];

function NotificationsList({ notifications, onMarkAsRead }: { 
  notifications: Notification[]; 
  onMarkAsRead: (id: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => 
      filter === 'all' || !notification.read
    );
  }, [notifications, filter]);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return '📦';
      case 'delivery': return '🚚';
      case 'system': return '⚙️';
      case 'alert': return '⚠️';
      case 'warning': return '🔔';
      default: return '📢';
    }
  };

  const getChannelIcon = (channel: Notification['channel']) => {
    switch (channel) {
      case 'email': return '📧';
      case 'push': return '📱';
      case 'sms': return '💬';
      case 'all': return '🔊';
      default: return '📢';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Уведомления</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            Непрочитанные
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
              notification.read 
                ? 'border-white/10 bg-white/5' 
                : 'border-blue-500/30 bg-blue-500/10'
            } hover:border-white/20`}
            onClick={() => !notification.read && onMarkAsRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl mt-1">
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`font-semibold ${
                    notification.read ? 'text-white' : 'text-blue-400'
                  }`}>
                    {notification.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getChannelIcon(notification.channel)}
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                
                <p className="text-sm text-gray-300 mb-2">
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString('ru-RU')}
                  </div>
                  {notification.actionUrl && (
                    <button className="text-xs text-blue-400 hover:text-blue-300">
                      Подробнее →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-400">Уведомлений нет</p>
        </div>
      )}
    </div>
  );
}

function TemplatesManager() {
  const [templates, setTemplates] = useState(notificationTemplates);

  const toggleTemplate = (id: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === id ? { ...template, enabled: !template.enabled } : template
    ));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Шаблоны уведомлений</h3>
      
      <div className="space-y-4">
        {templates.map(template => (
          <div key={template.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-white">{template.name}</div>
                <div className="text-sm text-gray-400">
                  Триггер: {template.triggers.join(', ')}
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.enabled}
                  onChange={() => toggleTemplate(template.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-400">Заголовок:</div>
                <div className="text-white text-sm">{template.title}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Сообщение:</div>
                <div className="text-white text-sm">{template.message}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-400">Каналы:</div>
                <div className="flex gap-1">
                  {template.channels.map(channel => (
                    <span key={channel} className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
                Редактировать
              </button>
              <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm">
                Тестировать
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
        + Создать новый шаблон
      </button>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    categories: {
      order: true,
      delivery: true,
      system: false,
      alert: true
    }
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings]
    }));
  };

  const toggleCategory = (category: keyof typeof settings.categories) => {
    setSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Настройки уведомлений</h3>
      
      <div className="space-y-6">
        {/* Channels */}
        <div>
          <h4 className="font-semibold text-white mb-3">Каналы уведомлений</h4>
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Email уведомления', icon: '📧' },
              { key: 'push', label: 'Push уведомления', icon: '📱' },
              { key: 'sms', label: 'SMS уведомления', icon: '💬' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-white">{item.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={() => toggleSetting(item.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-white mb-3">Категории уведомлений</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'order', label: 'Заказы', icon: '📦' },
              { key: 'delivery', label: 'Доставка', icon: '🚚' },
              { key: 'system', label: 'Система', icon: '⚙️' },
              { key: 'alert', label: 'Оповещения', icon: '⚠️' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-white text-sm">{item.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.categories[item.key as keyof typeof settings.categories]}
                    onChange={() => toggleCategory(item.key as keyof typeof settings.categories)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-gray-700 peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h4 className="font-semibold text-white mb-3">Тихие часы</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Включить тихие часы</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.quietHours.enabled}
                  onChange={() => setSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Начало</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Конец</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState('notifications');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Уведомления</h1>
          <p className="text-gray-400 mt-2">Управление уведомлениями и настройками оповещений</p>
        </div>
        
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white"
            >
              Прочитать все ({unreadCount})
            </button>
          )}
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
            📧 Тестовая отправка
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Уведомления
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'templates' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Шаблоны
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Настройки
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'notifications' && (
        <NotificationsList 
          notifications={notifications} 
          onMarkAsRead={markAsRead}
        />
      )}

      {activeTab === 'templates' && <TemplatesManager />}

      {activeTab === 'settings' && <NotificationSettings />}
    </div>
  );
}