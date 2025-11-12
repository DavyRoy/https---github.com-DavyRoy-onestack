'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'reminder' | 'confirmation' | 'cancellation' | 'followup';
  channel: 'email' | 'sms' | 'push';
  subject: string;
  message: string;
  trigger: string;
  active: boolean;
}

interface NotificationLog {
  id: string;
  templateId: string;
  customer: string;
  channel: string;
  status: 'sent' | 'delivered' | 'failed';
  sentAt: string;
  bookingId: string;
}

const TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Напоминание за 24 часа',
    type: 'reminder',
    channel: 'sms',
    subject: 'Напоминание о записи',
    message: 'Напоминаем о вашей записи завтра в {time}. Ждем вас!',
    trigger: '24_hours_before',
    active: true
  },
  {
    id: '2',
    name: 'Подтверждение брони',
    type: 'confirmation',
    channel: 'email',
    subject: 'Подтверждение записи',
    message: 'Ваша запись на {date} в {time} подтверждена. Ссылка для отмены: {cancel_link}',
    trigger: 'immediately',
    active: true
  },
  {
    id: '3',
    name: 'Спасибо после посещения',
    type: 'followup',
    channel: 'email',
    subject: 'Спасибо за посещение!',
    message: 'Благодарим за визит! Оставьте отзыв: {review_link}',
    trigger: '1_hour_after',
    active: false
  },
  {
    id: '4',
    name: 'Отмена записи',
    type: 'cancellation',
    channel: 'sms',
    subject: 'Отмена записи',
    message: 'Ваша запись на {date} отменена. Хотите перенести? {reschedule_link}',
    trigger: 'immediately',
    active: true
  },
];

const NOTIFICATION_LOGS: NotificationLog[] = [
  { id: '1', templateId: '1', customer: 'Иван Петров', channel: 'sms', status: 'delivered', sentAt: '2024-11-15 14:30', bookingId: 'B001' },
  { id: '2', templateId: '2', customer: 'Мария Сидорова', channel: 'email', status: 'sent', sentAt: '2024-11-15 10:15', bookingId: 'B002' },
  { id: '3', templateId: '1', customer: 'Алексей Иванов', channel: 'sms', status: 'failed', sentAt: '2024-11-14 16:45', bookingId: 'B003' },
  { id: '4', templateId: '4', customer: 'Елена Козлова', channel: 'sms', status: 'delivered', sentAt: '2024-11-14 09:20', bookingId: 'B004' },
];

export default function BookingNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs' | 'settings'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-500/20';
      case 'sent': return 'text-blue-400 bg-blue-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'push': return '📱';
      default: return '✉️';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo/services/manager"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад к дашборду
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-semibold">Уведомления о брони</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Массовая рассылка
              </button>
              <button 
                onClick={() => setIsCreatingTemplate(true)}
                className="bg-green-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-600 transition-colors"
              >
                + Шаблон
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          {[
            { id: 'templates', label: 'Шаблоны', count: TEMPLATES.length },
            { id: 'logs', label: 'История', count: NOTIFICATION_LOGS.length },
            { id: 'settings', label: 'Настройки' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-4 px-6 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="bg-white/10 rounded-full px-2 py-1 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-gray-400">Отправлено сегодня</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">94%</div>
            <div className="text-sm text-gray-400">Доставлено</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-400">Активных шаблонов</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">2.1%</div>
            <div className="text-sm text-gray-400">Отказов</div>
          </div>
        </div>

        {activeTab === 'templates' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Шаблоны уведомлений</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>{getChannelIcon(template.channel)} {template.channel}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            template.active 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {template.active ? 'Активен' : 'Неактивен'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-colors"
                      >
                        ✏️
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Тип:</span>
                        <span>
                          {template.type === 'reminder' ? 'Напоминание' :
                           template.type === 'confirmation' ? 'Подтверждение' :
                           template.type === 'cancellation' ? 'Отмена' : 'Фоллоу-ап'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Триггер:</span>
                        <span>
                          {template.trigger === 'immediately' ? 'Сразу' :
                           template.trigger === '24_hours_before' ? 'За 24 часа' :
                           template.trigger === '1_hour_after' ? 'Через 1 час' : template.trigger}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="text-sm text-gray-400 mb-2">Сообщение:</div>
                      <p className="text-sm leading-relaxed line-clamp-3">
                        {template.message}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                        {template.active ? 'Выключить' : 'Включить'}
                      </button>
                      <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                        Тест
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {TEMPLATES.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-30">📋</div>
                <h3 className="text-xl font-semibold mb-2">Шаблоны не найдены</h3>
                <p className="text-gray-400 mb-6">
                  Создайте первый шаблон уведомлений
                </p>
                <button
                  onClick={() => setIsCreatingTemplate(true)}
                  className="bg-blue-500 text-white rounded-xl px-6 py-3 hover:bg-blue-600 transition-colors"
                >
                  + Создать шаблон
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">История уведомлений</h2>
              <div className="flex gap-3">
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Все статусы</option>
                  <option>Доставлено</option>
                  <option>Отправлено</option>
                  <option>Ошибка</option>
                </select>
                <input
                  type="text"
                  placeholder="Поиск по клиенту..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Дата</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Клиент</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Канал</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Шаблон</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Статус</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Бронь</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NOTIFICATION_LOGS.map((log) => {
                      const template = TEMPLATES.find(t => t.id === log.templateId);
                      
                      return (
                        <tr key={log.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 text-sm">{log.sentAt}</td>
                          <td className="py-4 px-6 font-semibold">{log.customer}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <span>{getChannelIcon(log.channel)}</span>
                              <span className="text-sm capitalize">{log.channel}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm">{template?.name}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(log.status)}`}>
                              <span>
                                {log.status === 'delivered' ? 'Доставлено' :
                                 log.status === 'sent' ? 'Отправлено' : 'Ошибка'}
                              </span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm font-mono">{log.bookingId}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Настройки уведомлений</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Channel Settings */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-6">Настройки каналов</h3>
                <div className="space-y-6">
                  {[
                    { channel: 'Email', enabled: true, description: 'Отправка на email клиента' },
                    { channel: 'SMS', enabled: true, description: 'Отправка SMS сообщений' },
                    { channel: 'Push', enabled: false, description: 'Push-уведомления в приложении' },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <div className="font-semibold">{setting.channel}</div>
                        <div className="text-sm text-gray-400">{setting.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={setting.enabled}
                          className="sr-only peer"
                          onChange={() => {}}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timing Settings */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-6">Время отправки</h3>
                <div className="space-y-6">
                  {[
                    { name: 'Рабочие часы', time: '09:00 - 21:00', description: 'Отправка только в рабочее время' },
                    { name: 'Напоминания', time: 'За 24 часа', description: 'Время напоминания о записи' },
                    { name: 'Фоллоу-апы', time: 'Через 1 час', description: 'Время отправки после визита' },
                  ].map((setting, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-xl">
                      <div className="font-semibold mb-1">{setting.name}</div>
                      <div className="text-sm text-gray-400 mb-3">{setting.description}</div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={setting.time}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition-colors">
                          Сохранить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Template Editor Modal */}
      {(selectedTemplate || isCreatingTemplate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {isCreatingTemplate ? 'Создание шаблона' : 'Редактирование шаблона'}
              </h2>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setIsCreatingTemplate(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Название шаблона</label>
                  <input
                    type="text"
                    defaultValue={selectedTemplate?.name}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Например: Напоминание за 24 часа"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Тип уведомления</label>
                  <select 
                    defaultValue={selectedTemplate?.type}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="reminder">Напоминание</option>
                    <option value="confirmation">Подтверждение</option>
                    <option value="cancellation">Отмена</option>
                    <option value="followup">Фоллоу-ап</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Канал отправки</label>
                  <select 
                    defaultValue={selectedTemplate?.channel}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="push">Push</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Триггер отправки</label>
                  <select 
                    defaultValue={selectedTemplate?.trigger}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="immediately">Сразу</option>
                    <option value="24_hours_before">За 24 часа</option>
                    <option value="2_hours_before">За 2 часа</option>
                    <option value="1_hour_after">Через 1 час</option>
                    <option value="1_day_after">Через 1 день</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Тема (для email)</label>
                <input
                  type="text"
                  defaultValue={selectedTemplate?.subject}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Тема сообщения"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Текст сообщения</label>
                <textarea
                  rows={6}
                  defaultValue={selectedTemplate?.message}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Текст уведомления..."
                />
                <div className="text-xs text-gray-400 mt-2">
                  Доступные переменные: {'{customer_name}'}, {'{service_name}'}, {'{date}'}, {'{time}'}, {'{cancel_link}'}, {'{reschedule_link}'}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={selectedTemplate?.active}
                  className="rounded bg-white/5 border-white/10"
                  id="template-active"
                />
                <label htmlFor="template-active" className="text-sm text-gray-400">
                  Шаблон активен
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setIsCreatingTemplate(false);
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button className="flex-1 bg-blue-500 text-white rounded-lg py-3 hover:bg-blue-600 transition-colors">
                  {isCreatingTemplate ? 'Создать шаблон' : 'Сохранить изменения'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}