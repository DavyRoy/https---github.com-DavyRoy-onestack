'use client';

import React, { useState } from 'react';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'auto' | 'manual';
  trigger: string;
  channels: ('sms' | 'email' | 'push')[];
  enabled: boolean;
  content: {
    sms: string;
    email: {
      subject: string;
      body: string;
    };
  };
  stats: {
    sent: number;
    delivered: number;
    opened: number;
  };
}

const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Заявка принята',
    type: 'auto',
    trigger: 'repair_request_created',
    channels: ['sms', 'email'],
    enabled: true,
    content: {
      sms: 'Ваша заявка №{order_id} принята. Ожидайте звонка для уточнения деталей. СТО АвтоПрофи',
      email: {
        subject: 'Заявка на ремонт принята - #{order_id}',
        body: 'Уважаемый {client_name}, ваша заявка на ремонт автомобиля {car_model} принята. Мы свяжемся с вами в ближайшее время.'
      }
    },
    stats: {
      sent: 1248,
      delivered: 1205,
      opened: 856
    }
  },
  {
    id: '2',
    name: 'Авто готово',
    type: 'auto',
    trigger: 'repair_completed',
    channels: ['sms', 'email', 'push'],
    enabled: true,
    content: {
      sms: 'Ваш автомобиль {car_model} готов. Можете забрать его в рабочее время. СТО АвтоПрофи',
      email: {
        subject: 'Ваш автомобиль готов - #{order_id}',
        body: 'Уважаемый {client_name}, ремонт вашего автомобиля {car_model} завершён. Вы можете забрать его в удобное время.'
      }
    },
    stats: {
      sent: 985,
      delivered: 952,
      opened: 712
    }
  },
  {
    id: '3',
    name: 'Требуется согласование',
    type: 'auto',
    trigger: 'approval_required',
    channels: ['sms'],
    enabled: true,
    content: {
      sms: 'Требуется согласование дополнительных работ по {car_model}. Пожалуйста, перезвоните нам. СТО АвтоПрофи',
      email: {
        subject: 'Требуется согласование работ - #{order_id}',
        body: 'Уважаемый {client_name}, в процессе ремонта выявлены дополнительные работы. Пожалуйста, свяжитесь с нами для согласования.'
      }
    },
    stats: {
      sent: 342,
      delivered: 328,
      opened: 298
    }
  },
  {
    id: '4',
    name: 'Напоминание о ТО',
    type: 'auto',
    trigger: 'maintenance_reminder',
    channels: ['email'],
    enabled: false,
    content: {
      sms: 'Напоминаем о необходимости планового ТО для {car_model}. Запишитесь онлайн. СТО АвтоПрофи',
      email: {
        subject: 'Напоминание о плановом ТО',
        body: 'Уважаемый {client_name}, рекомендуем запланировать плановое техническое обслуживание для {car_model}.'
      }
    },
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0
    }
  }
];

export default function NotificationsManager() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(NOTIFICATION_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template =>
      template.id === templateId
        ? { ...template, enabled: !template.enabled }
        : template
    ));
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return '📱';
      case 'email': return '📧';
      case 'push': return '🔔';
      default: return '❓';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'sms': return 'bg-blue-500/20 text-blue-300';
      case 'email': return 'bg-green-500/20 text-green-300';
      case 'push': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Templates List */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-6">Шаблоны уведомлений</h2>
        
        <div className="space-y-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleTemplate(template.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      template.enabled ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        template.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>

                  {/* Template Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-white">{template.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        template.type === 'auto' 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {template.type === 'auto' ? 'Авто' : 'Ручная'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {template.channels.map(channel => (
                        <span
                          key={channel}
                          className={`px-2 py-1 rounded-full text-xs ${getChannelColor(channel)}`}
                        >
                          {getChannelIcon(channel)} {channel.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-white/60 text-sm">
                      Триггер: {template.trigger === 'repair_request_created' ? 'Создание заявки' :
                              template.trigger === 'repair_completed' ? 'Завершение ремонта' :
                              template.trigger === 'approval_required' ? 'Требуется согласование' :
                              'Напоминание о ТО'}
                    </p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center gap-4">
                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-white text-sm">
                      {template.stats.sent} отправлено
                    </div>
                    <div className="text-white/60 text-xs">
                      {Math.round((template.stats.delivered / template.stats.sent) * 100)}% доставлено
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsEditing(true);
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Редактировать"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="p-2 text-green-400 hover:text-green-300 transition-colors"
                      title="Предпросмотр"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Template */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-4">Создать новый шаблон</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium text-white">Ручная рассылка</div>
            <div className="text-white/60 text-sm mt-1">Разовые уведомления</div>
          </button>
          
          <button className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium text-white">Авто-уведомление</div>
            <div className="text-white/60 text-sm mt-1">По событиям системы</div>
          </button>
          
          <button className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-white">Из шаблона</div>
            <div className="text-white/60 text-sm mt-1">Использовать готовый</div>
          </button>
        </div>
      </div>

      {/* Template Preview/Edit Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? 'Редактирование шаблона' : 'Предпросмотр'}
              </h2>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setIsEditing(false);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Template Info */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Название шаблона</label>
                <input
                  type="text"
                  value={selectedTemplate.name}
                  readOnly={!isEditing}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Channels */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Каналы отправки</label>
                <div className="flex gap-2">
                  {(['sms', 'email', 'push'] as const).map(channel => (
                    <label key={channel} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTemplate.channels.includes(channel)}
                        readOnly={!isEditing}
                        className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-white/80 text-sm">
                        {getChannelIcon(channel)} {channel.toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SMS Content */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  📱 SMS сообщение
                </label>
                <textarea
                  value={selectedTemplate.content.sms}
                  readOnly={!isEditing}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none"
                />
                <div className="text-white/60 text-xs mt-1">
                  {selectedTemplate.content.sms.length}/160 символов
                </div>
              </div>

              {/* Email Content */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  📧 Email сообщение
                </label>
                <input
                  type="text"
                  value={selectedTemplate.content.email.subject}
                  readOnly={!isEditing}
                  placeholder="Тема письма"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 mb-2"
                />
                <textarea
                  value={selectedTemplate.content.email.body}
                  readOnly={!isEditing}
                  rows={4}
                  placeholder="Текст письма"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {isEditing ? (
                  <>
                    <button className="flex-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg py-3 hover:bg-green-500/30 transition-colors">
                      Сохранить изменения
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                    >
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg py-3 hover:bg-blue-500/30 transition-colors"
                    >
                      Редактировать
                    </button>
                    <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors">
                      Тестовая отправка
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}