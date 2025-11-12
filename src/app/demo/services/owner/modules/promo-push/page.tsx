'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PushCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  audience: string;
  message: string;
  scheduledFor: string;
  sent: number;
  delivered: number;
  opened: number;
  conversion: number;
  budget: number;
  spent: number;
}

interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  userCount: number;
}

const CAMPAIGNS: PushCampaign[] = [
  {
    id: '1',
    name: 'Скидка 20% на стрижки',
    status: 'active',
    audience: 'Все клиенты',
    message: 'Успейте записаться! Скидка 20% на все стрижки до конца недели 🎉',
    scheduledFor: '2024-11-15 10:00',
    sent: 1250,
    delivered: 1187,
    opened: 856,
    conversion: 42,
    budget: 5000,
    spent: 3200
  },
  {
    id: '2',
    name: 'Новая услуга - SPA',
    status: 'scheduled',
    audience: 'VIP клиенты',
    message: 'Представляем новую SPA-процедуру! Забронируйте первыми со скидкой 15% 💆‍♀️',
    scheduledFor: '2024-11-20 09:00',
    sent: 0,
    delivered: 0,
    opened: 0,
    conversion: 0,
    budget: 3000,
    spent: 0
  },
  {
    id: '3',
    name: 'Напоминание о брони',
    status: 'completed',
    audience: 'С сегодняшней записью',
    message: 'Напоминаем о вашей записи сегодня в {time}. Ждем вас! ⏰',
    scheduledFor: '2024-11-14 08:00',
    sent: 45,
    delivered: 45,
    opened: 38,
    conversion: 0,
    budget: 0,
    spent: 0
  },
  {
    id: '4',
    name: 'Акция "Приведи друга"',
    status: 'paused',
    audience: 'Постоянные клиенты',
    message: 'Приведите друга и получите скидку 25% на следующую услугу! 👥',
    scheduledFor: '2024-11-25 11:00',
    sent: 320,
    delivered: 298,
    opened: 187,
    conversion: 15,
    budget: 2000,
    spent: 850
  },
];

const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: '1',
    name: 'Все клиенты',
    description: 'Все пользователи приложения',
    criteria: ['Все пользователи'],
    userCount: 1250
  },
  {
    id: '2',
    name: 'VIP клиенты',
    description: 'Клиенты с уровнем Gold и Platinum',
    criteria: ['Уровень лояльности: Gold', 'Уровень лояльности: Platinum'],
    userCount: 187
  },
  {
    id: '3',
    name: 'Новые клиенты',
    description: 'Клиенты с 1-2 посещениями',
    criteria: ['Количество посещений: 1-2'],
    userCount: 320
  },
  {
    id: '4',
    name: 'Постоянные клиенты',
    description: 'Клиенты с 5+ посещениями',
    criteria: ['Количество посещений: 5+'],
    userCount: 456
  },
  {
    id: '5',
    name: 'Неактивные',
    description: 'Не посещали более 30 дней',
    criteria: ['Последнее посещение: >30 дней'],
    userCount: 289
  },
];

export default function PromoPushPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'audience' | 'analytics'>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<PushCampaign | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignStep, setCampaignStep] = useState<1 | 2 | 3>(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'scheduled': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-gray-400 bg-gray-500/20';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20';
      case 'draft': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'scheduled': return 'Запланирована';
      case 'completed': return 'Завершена';
      case 'paused': return 'На паузе';
      case 'draft': return 'Черновик';
      default: return status;
    }
  };

  const calculateCTR = (campaign: PushCampaign) => {
    if (campaign.delivered === 0) return 0;
    return (campaign.opened / campaign.delivered) * 100;
  };

  const calculateROI = (campaign: PushCampaign) => {
    if (campaign.spent === 0) return 0;
    // Mock ROI calculation - in real app this would use actual revenue data
    return (campaign.conversion * 500 - campaign.spent) / campaign.spent * 100;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo/services/owner"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Назад к дашборду
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <h1 className="text-xl font-semibold">Push-уведомления</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                A/B Тестирование
              </button>
              <button 
                onClick={() => setIsCreatingCampaign(true)}
                className="bg-green-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-600 transition-colors"
              >
                + Кампания
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
            { id: 'campaigns', label: 'Кампании', count: CAMPAIGNS.length },
            { id: 'audience', label: 'Аудитория', count: AUDIENCE_SEGMENTS.length },
            { id: 'analytics', label: 'Аналитика' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-4 px-6 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">1,250</div>
            <div className="text-sm text-gray-400">Всего пользователей</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">68%</div>
            <div className="text-sm text-gray-400">Средний CTR</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">4.2%</div>
            <div className="text-sm text-gray-400">Конверсия</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">187%</div>
            <div className="text-sm text-gray-400">ROI</div>
          </div>
        </div>

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Кампании</h2>
              <div className="flex gap-3">
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Все статусы</option>
                  <option>Активные</option>
                  <option>Запланированные</option>
                  <option>Завершенные</option>
                  <option>На паузе</option>
                </select>
                <input
                  type="text"
                  placeholder="Поиск кампаний..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {CAMPAIGNS.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    {/* Campaign Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-400">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                            {getStatusLabel(campaign.status)}
                          </span>
                          <span>•</span>
                          <span>{campaign.audience}</span>
                          <span>•</span>
                          <span>{campaign.scheduledFor}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-colors"
                      >
                        ✏️
                      </button>
                    </div>

                    {/* Campaign Message */}
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-sm leading-relaxed">{campaign.message}</p>
                    </div>

                    {/* Campaign Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{campaign.sent}</div>
                        <div className="text-xs text-gray-400">Отправлено</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.delivered}</div>
                        <div className="text-xs text-gray-400">Доставлено</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{calculateCTR(campaign).toFixed(1)}%</div>
                        <div className="text-xs text-gray-400">CTR</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{campaign.conversion}</div>
                        <div className="text-xs text-gray-400">Конверсия</div>
                      </div>
                    </div>

                    {/* Budget & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-sm">
                        <span className="text-gray-400">Бюджет: </span>
                        <span className="font-semibold">{campaign.spent.toLocaleString()} ₽</span>
                        <span className="text-gray-400"> / {campaign.budget.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'draft' && (
                          <button className="bg-green-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-green-600 transition-colors">
                            Запустить
                          </button>
                        )}
                        {campaign.status === 'active' && (
                          <button className="bg-yellow-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-yellow-600 transition-colors">
                            Пауза
                          </button>
                        )}
                        {campaign.status === 'paused' && (
                          <button className="bg-green-500 text-white rounded-lg px-3 py-1 text-sm hover:bg-green-600 transition-colors">
                            Возобновить
                          </button>
                        )}
                        <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                          Дублировать
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {CAMPAIGNS.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-30">📢</div>
                <h3 className="text-xl font-semibold mb-2">Кампаний пока нет</h3>
                <p className="text-gray-400 mb-6">
                  Создайте первую push-кампанию для привлечения клиентов
                </p>
                <button
                  onClick={() => setIsCreatingCampaign(true)}
                  className="bg-purple-500 text-white rounded-xl px-6 py-3 hover:bg-purple-600 transition-colors"
                >
                  + Создать кампанию
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Сегменты аудитории</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AUDIENCE_SEGMENTS.map((segment) => (
                <div
                  key={segment.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{segment.name}</h3>
                      <p className="text-sm text-gray-400">{segment.description}</p>
                    </div>

                    <div className="space-y-2">
                      {segment.criteria.map((criterion, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="text-green-400">✓</div>
                          <span>{criterion}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-sm text-gray-400">
                        {segment.userCount.toLocaleString()} пользователей
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                          Использовать
                        </button>
                        <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                          Редактировать
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Segment */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-4xl mb-4 opacity-60">👥</div>
                <h3 className="font-semibold text-lg mb-2">Создать новый сегмент</h3>
                <p className="text-gray-400 mb-4">
                  Настройте целевую аудиторию для точного таргетинга
                </p>
                <button className="bg-purple-500 text-white rounded-xl px-6 py-3 hover:bg-purple-600 transition-colors">
                  + Новый сегмент
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Аналитика кампаний</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Overview */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-6">Общая эффективность</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Всего кампаний', value: CAMPAIGNS.length, change: '+2' },
                    { label: 'Активные кампании', value: CAMPAIGNS.filter(c => c.status === 'active').length, change: '+1' },
                    { label: 'Средний CTR', value: '68.2%', change: '+5.4%' },
                    { label: 'Общий ROI', value: '187%', change: '+23%' },
                    { label: 'Расходы', value: '4,050 ₽', change: '+1,200 ₽' },
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                      <span className="text-sm text-gray-400">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{metric.value}</span>
                        <span className="text-green-400 text-xs">{metric.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Performance */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-6">Эффективность по кампаниям</h3>
                <div className="space-y-4">
                  {CAMPAIGNS.filter(c => c.status === 'completed' || c.status === 'active').map((campaign) => (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{campaign.name}</span>
                        <span className="text-sm">{calculateROI(campaign).toFixed(0)}% ROI</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(calculateROI(campaign), 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>CTR: {calculateCTR(campaign).toFixed(1)}%</span>
                        <span>Конверсия: {campaign.conversion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audience Insights */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-6">Инсайты аудитории</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Лучший канал', value: 'Push-уведомления', description: 'Наибольшая конверсия' },
                  { title: 'Оптимальное время', value: '10:00 - 12:00', description: 'Пиковая активность' },
                  { title: 'Лучший день', value: 'Вторник', description: 'Высокий CTR' },
                ].map((insight, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold mb-2">{insight.value}</div>
                    <div className="text-sm font-semibold mb-1">{insight.title}</div>
                    <div className="text-xs text-gray-400">{insight.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Campaign Creation/Edit Modal */}
      {(selectedCampaign || isCreatingCampaign) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {isCreatingCampaign ? 'Создание кампании' : 'Редактирование кампании'}
              </h2>
              <button
                onClick={() => {
                  setSelectedCampaign(null);
                  setIsCreatingCampaign(false);
                  setCampaignStep(1);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      campaignStep >= step 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {step}
                    </div>
                    <span className={`text-sm ${
                      campaignStep >= step ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step === 1 && 'Аудитория'}
                      {step === 2 && 'Сообщение'}
                      {step === 3 && 'Запуск'}
                    </span>
                    {step < 3 && (
                      <div className="w-12 h-px bg-white/20 ml-8"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {campaignStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Выбор аудитории</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Название кампании</label>
                  <input
                    type="text"
                    defaultValue={selectedCampaign?.name}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Например: Скидка 20% на стрижки"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Целевая аудитория</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {AUDIENCE_SEGMENTS.map((segment) => (
                      <label key={segment.id} className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                        <input type="radio" name="audience" className="text-purple-500" />
                        <div>
                          <div className="font-semibold">{segment.name}</div>
                          <div className="text-sm text-gray-400">
                            {segment.userCount.toLocaleString()} пользователей
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setCampaignStep(2)}
                    className="bg-purple-500 text-white rounded-lg px-6 py-2 hover:bg-purple-600 transition-colors"
                  >
                    Далее: Сообщение
                  </button>
                </div>
              </div>
            )}

            {campaignStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Создание сообщения</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Текст уведомления</label>
                  <textarea
                    rows={4}
                    defaultValue={selectedCampaign?.message}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Введите текст push-уведомления..."
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    Максимум 120 символов. Текущее количество: {selectedCampaign?.message?.length || 0}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Превью уведомления</label>
                  <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">S</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Салон красоты</div>
                        <div className="text-xs text-gray-300 mt-1">
                          {selectedCampaign?.message || 'Текст уведомления появится здесь...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCampaignStep(1)}
                    className="bg-white/5 border border-white/10 rounded-lg px-6 py-2 hover:bg-white/10 transition-colors"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => setCampaignStep(3)}
                    className="bg-purple-500 text-white rounded-lg px-6 py-2 hover:bg-purple-600 transition-colors"
                  >
                    Далее: Запуск
                  </button>
                </div>
              </div>
            )}

            {campaignStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Настройка запуска</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Дата и время отправки</label>
                    <input
                      type="datetime-local"
                      defaultValue={selectedCampaign?.scheduledFor.replace(' ', 'T')}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Бюджет кампании</label>
                    <input
                      type="number"
                      defaultValue={selectedCampaign?.budget}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Бюджет в рублях"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Статус кампании</label>
                  <select 
                    defaultValue={selectedCampaign?.status || 'draft'}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Черновик</option>
                    <option value="scheduled">Запланировать</option>
                    <option value="active">Запустить сразу</option>
                  </select>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Сводка кампании</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Аудитория:</span>
                      <span>Все клиенты (1,250 пользователей)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Бюджет:</span>
                      <span>5,000 ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Запуск:</span>
                      <span>Сразу после создания</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setCampaignStep(2)}
                    className="bg-white/5 border border-white/10 rounded-lg px-6 py-2 hover:bg-white/10 transition-colors"
                  >
                    Назад
                  </button>
                  <button className="bg-green-500 text-white rounded-lg px-6 py-2 hover:bg-green-600 transition-colors">
                    {isCreatingCampaign ? 'Создать кампанию' : 'Сохранить изменения'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}