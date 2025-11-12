'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'delay' | 'cancellation' | 'route_change' | 'system';
  title: string;
  message: string;
  routes: string[];
  severity: 'low' | 'medium' | 'high';
  status: 'draft' | 'sent' | 'scheduled';
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  recipients: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'delay' | 'cancellation' | 'route_change';
  subject: string;
  message: string;
  isActive: boolean;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'outbox' | 'templates' | 'settings'>('outbox');
  const [isCreating, setIsCreating] = useState(false);

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'delay',
      title: 'Задержка рейса 101А',
      message: 'Рейс 101А Москва-СПб задерживается на 15 минут due to weather conditions',
      routes: ['101А'],
      severity: 'medium',
      status: 'sent',
      createdAt: '2024-01-15T08:30:00Z',
      sentAt: '2024-01-15T08:35:00Z',
      recipients: 47
    },
    {
      id: '2',
      type: 'cancellation',
      title: 'Отмена рейса 303В',
      message: 'Рейс 303В Москва-Казань отменен due to technical issues',
      routes: ['303В'],
      severity: 'high',
      status: 'sent',
      createdAt: '2024-01-14T15:20:00Z',
      sentAt: '2024-01-14T15:25:00Z',
      recipients: 23
    },
    {
      id: '3',
      type: 'route_change',
      title: 'Изменение маршрута 202Б',
      message: 'Временное изменение остановок на маршруте 202Б',
      routes: ['202Б'],
      severity: 'low',
      status: 'scheduled',
      createdAt: '2024-01-15T10:00:00Z',
      scheduledFor: '2024-01-16T07:00:00Z',
      recipients: 0
    }
  ];

  const templates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Шаблон задержки',
      type: 'delay',
      subject: 'Задержка рейса {route}',
      message: 'Уважаемый пассажир! Рейс {route} задерживается на {delay} минут. Приносим извинения за неудобства.',
      isActive: true
    },
    {
      id: '2',
      name: 'Шаблон отмены',
      type: 'cancellation',
      subject: 'Отмена рейса {route}',
      message: 'Уважаемый пассажир! Рейс {route} отменен. Для возврата средств обратитесь в кассу.',
      isActive: true
    },
    {
      id: '3',
      name: 'Изменение маршрута',
      type: 'route_change',
      subject: 'Изменение маршрута {route}',
      message: 'Уважаемый пассажир! В маршрут {route} внесены временные изменения.',
      isActive: false
    }
  ];

  const stats = {
    sentToday: 12,
    scheduled: 3,
    recipients: 1560,
    openRate: 78
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/demo/transport/manager" className="text-gray-400 hover:text-white transition-colors">
                ← Дашборд
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-white font-medium">Уведомления</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-sm"
              >
                + Создать уведомление
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
              <div className="text-2xl font-bold text-white mb-2">{stats.sentToday}</div>
              <div className="text-sm text-gray-400">Отправлено сегодня</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.scheduled}</div>
              <div className="text-sm text-gray-400">Запланировано</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400 mb-2">{stats.recipients}</div>
              <div className="text-sm text-gray-400">Получателей</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400 mb-2">{stats.openRate}%</div>
              <div className="text-sm text-gray-400">Открытий</div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-6">
          <div className="flex bg-white/5 rounded-xl p-1">
            {(['outbox', 'templates', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg transition-colors capitalize ${
                  activeTab === tab ? 'bg-blue-500 text-white' : 'text-gray-400'
                }`}
              >
                {tab === 'outbox' ? 'Исходящие' :
                 tab === 'templates' ? 'Шаблоны' : 'Настройки'}
              </button>
            ))}
          </div>
        </section>

        {activeTab === 'outbox' && (
          <section>
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        notification.type === 'delay' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                        notification.type === 'cancellation' ? 'bg-red-500/20 border border-red-500/30' :
                        'bg-blue-500/20 border border-blue-500/30'
                      }`}>
                        {notification.type === 'delay' ? '⏰' :
                         notification.type === 'cancellation' ? '❌' : '🔄'}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white mb-1">{notification.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Маршруты:</span>
                            <div className="flex gap-1">
                              {notification.routes.map(route => (
                                <span key={route} className="px-2 py-1 rounded-full bg-white/5 text-white/80">
                                  {route}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Статус:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              notification.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                              notification.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {notification.status === 'sent' ? 'Отправлено' :
                               notification.status === 'scheduled' ? 'Запланировано' : 'Черновик'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {notification.status === 'sent' && (
                        <span className="text-sm text-gray-400">
                          {notification.recipients} получателей
                        </span>
                      )}
                      <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                        Дублировать
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-400">
                      {notification.status === 'sent' 
                        ? `Отправлено: ${new Date(notification.sentAt!).toLocaleString()}`
                        : notification.status === 'scheduled'
                        ? `Запланировано на: ${new Date(notification.scheduledFor!).toLocaleString()}`
                        : `Создано: ${new Date(notification.createdAt).toLocaleString()}`
                      }
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                        Статистика
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors text-sm">
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                        template.type === 'delay' ? 'bg-yellow-500/20 text-yellow-400' :
                        template.type === 'cancellation' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {template.type === 'delay' ? 'Задержка' :
                         template.type === 'cancellation' ? 'Отмена' : 'Изменение маршрута'}
                      </span>
                    </div>
                    
                    <div className={`w-3 h-3 rounded-full ${
                      template.isActive ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  
                  <div className="space-y-3 text-sm mb-4">
                    <div>
                      <div className="text-gray-400 mb-1">Тема:</div>
                      <div className="text-white">{template.subject}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Сообщение:</div>
                      <div className="text-white">{template.message}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm">
                      Редактировать
                    </button>
                    <button className={`flex-1 py-2 rounded-xl border transition-colors text-sm ${
                      template.isActive
                        ? 'bg-red-500/20 border-red-500/30 hover:border-red-500/50 text-red-400'
                        : 'bg-green-500/20 border-green-500/30 hover:border-green-500/50 text-green-400'
                    }`}>
                      {template.isActive ? 'Деактивировать' : 'Активировать'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Notification Channels */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Каналы уведомлений</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Email', enabled: true, description: 'Отправка на электронную почту' },
                    { name: 'SMS', enabled: true, description: 'SMS сообщения' },
                    { name: 'Push-уведомления', enabled: false, description: 'Мобильные push-уведомления' },
                    { name: 'Telegram', enabled: false, description: 'Telegram бот' }
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <div className="font-semibold text-white">{channel.name}</div>
                        <div className="text-sm text-gray-400">{channel.description}</div>
                      </div>
                      <button className={`px-4 py-2 rounded-xl transition-colors text-sm ${
                        channel.enabled
                          ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                          : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
                      }`}>
                        {channel.enabled ? 'Включено' : 'Включить'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Settings */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-4">Настройки алертов</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Задержки > 15 мин', enabled: true },
                    { name: 'Отмены рейсов', enabled: true },
                    { name: 'Изменения маршрутов', enabled: true },
                    { name: 'Технические работы', enabled: false }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{alert.name}</span>
                      <button className={`w-12 h-6 rounded-full transition-colors ${
                        alert.enabled ? 'bg-blue-500' : 'bg-gray-600'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          alert.enabled ? 'transform translate-x-7' : 'transform translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Create Notification Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Создание уведомления</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Тип уведомления</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors">
                      <option value="delay">Задержка</option>
                      <option value="cancellation">Отмена</option>
                      <option value="route_change">Изменение маршрута</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Важность</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors">
                      <option value="low">Низкая</option>
                      <option value="medium">Средняя</option>
                      <option value="high">Высокая</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Заголовок</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Введите заголовок уведомления"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Сообщение</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Введите текст уведомления"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    Отмена
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-medium">
                    Создать уведомление
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}