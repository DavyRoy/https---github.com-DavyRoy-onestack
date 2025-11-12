'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LoyaltyTier {
  id: string;
  name: string;
  pointsRequired: number;
  benefits: string[];
  color: string;
}

interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: string;
  joinDate: string;
  totalSpent: number;
  visits: number;
}

interface LoyaltyRule {
  id: string;
  name: string;
  type: 'earn' | 'burn' | 'bonus';
  points: number;
  condition: string;
  active: boolean;
}

const TIERS: LoyaltyTier[] = [
  {
    id: '1',
    name: 'Стандарт',
    pointsRequired: 0,
    benefits: ['Начисление 1 балл за 100 ₽'],
    color: 'bg-gray-500'
  },
  {
    id: '2',
    name: 'Серебро',
    pointsRequired: 1000,
    benefits: ['Начисление 1.2 балла за 100 ₽', 'Приоритетная запись'],
    color: 'bg-gray-400'
  },
  {
    id: '3',
    name: 'Золото',
    pointsRequired: 5000,
    benefits: ['Начисление 1.5 балла за 100 ₽', 'Приоритетная запись', 'Персональный менеджер'],
    color: 'bg-yellow-500'
  },
  {
    id: '4',
    name: 'Платина',
    pointsRequired: 15000,
    benefits: ['Начисление 2 балла за 100 ₽', 'Приоритетная запись', 'Персональный менеджер', 'Подарки в день рождения'],
    color: 'bg-purple-500'
  }
];

const MEMBERS: LoyaltyMember[] = [
  { id: '1', name: 'Иван Петров', email: 'ivan@example.com', phone: '+7 999 123-45-67', points: 1540, tier: 'Серебро', joinDate: '2024-01-15', totalSpent: 154000, visits: 12 },
  { id: '2', name: 'Мария Сидорова', email: 'maria@example.com', phone: '+7 999 123-45-68', points: 320, tier: 'Стандарт', joinDate: '2024-03-22', totalSpent: 32000, visits: 3 },
  { id: '3', name: 'Алексей Иванов', email: 'alex@example.com', phone: '+7 999 123-45-69', points: 8720, tier: 'Золото', joinDate: '2023-11-08', totalSpent: 581000, visits: 45 },
  { id: '4', name: 'Елена Козлова', email: 'elena@example.com', phone: '+7 999 123-45-70', points: 21500, tier: 'Платина', joinDate: '2023-05-14', totalSpent: 1075000, visits: 89 },
];

const RULES: LoyaltyRule[] = [
  { id: '1', name: 'Начисление за покупки', type: 'earn', points: 1, condition: '1 балл за каждые 100 ₽', active: true },
  { id: '2', name: 'Бонус за отзыв', type: 'bonus', points: 50, condition: 'За оставленный отзыв', active: true },
  { id: '3', name: 'Списание баллов', type: 'burn', points: 100, condition: '100 баллов = 100 ₽ скидки', active: true },
  { id: '4', name: 'Бонус дня рождения', type: 'bonus', points: 500, condition: 'В месяц дня рождения', active: false },
];

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'tiers' | 'rules' | 'analytics'>('members');
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [pointsAction, setPointsAction] = useState<'add' | 'subtract'>('add');
  const [pointsAmount, setPointsAmount] = useState('');

  const getTierForPoints = (points: number) => {
    return TIERS.slice().reverse().find(tier => points >= tier.pointsRequired) || TIERS[0];
  };

  const handlePointsAction = () => {
    if (!selectedMember || !pointsAmount) return;
    
    // Mock points adjustment
    alert(`${pointsAction === 'add' ? 'Начисление' : 'Списание'} ${pointsAmount} баллов для ${selectedMember.name}`);
    setSelectedMember(null);
    setPointsAmount('');
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
              <h1 className="text-xl font-semibold">Программа лояльности</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Импорт
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Экспорт
              </button>
              <button className="bg-green-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-600 transition-colors">
                + Правило
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
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
          {[
            { id: 'members', label: 'Участники', count: MEMBERS.length },
            { id: 'tiers', label: 'Уровни', count: TIERS.length },
            { id: 'rules', label: 'Правила', count: RULES.length },
            { id: 'analytics', label: 'Аналитика' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-4 px-6 border-b-2 transition-colors whitespace-nowrap ${
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
            <div className="text-2xl font-bold">{MEMBERS.length}</div>
            <div className="text-sm text-gray-400">Участников</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">24,680</div>
            <div className="text-sm text-gray-400">Всего баллов</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">68%</div>
            <div className="text-sm text-gray-400">Активных</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">246K ₽</div>
            <div className="text-sm text-gray-400">Списано баллов</div>
          </div>
        </div>

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Участники программы</h2>
              <input
                type="text"
                placeholder="Поиск участников..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Участник</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Баллы</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Уровень</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Посещений</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Всего потрачено</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MEMBERS.map((member) => (
                      <tr key={member.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold">
                          {member.points.toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                            member.tier === 'Стандарт' ? 'bg-gray-500/20 text-gray-300' :
                            member.tier === 'Серебро' ? 'bg-gray-400/20 text-gray-300' :
                            member.tier === 'Золото' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-purple-500/20 text-purple-300'
                          }`}>
                            <span>{member.tier}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">{member.visits}</td>
                        <td className="py-4 px-6 text-right">{member.totalSpent.toLocaleString()} ₽</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedMember(member)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors"
                          >
                            Управление
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

        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Уровни лояльности</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
                      <h3 className="font-semibold text-lg">{tier.name}</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">
                        От {tier.pointsRequired.toLocaleString()} баллов
                      </div>
                      
                      <div className="space-y-2">
                        {tier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="text-green-400">✓</div>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-xs text-gray-400 mb-1">
                        Участников: {MEMBERS.filter(m => m.tier === tier.name).length}
                      </div>
                      <button className="w-full bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                        Редактировать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Правила начисления</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{rule.name}</h3>
                      <p className="text-gray-400 text-sm">{rule.condition}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      rule.active ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      rule.type === 'earn' 
                        ? 'bg-green-500/20 text-green-300'
                        : rule.type === 'burn'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {rule.type === 'earn' ? 'Начисление' : 
                       rule.type === 'burn' ? 'Списание' : 'Бонус'}
                    </span>
                    
                    <div className="text-2xl font-bold">
                      {rule.points}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                      Редактировать
                    </button>
                    <button className={`flex-1 rounded-lg py-2 text-sm transition-colors ${
                      rule.active
                        ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    }`}>
                      {rule.active ? 'Выключить' : 'Включить'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Аналитика программы</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tier Distribution */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-6">Распределение по уровням</h3>
                <div className="space-y-4">
                  {TIERS.map((tier) => {
                    const count = MEMBERS.filter(m => m.tier === tier.name).length;
                    const percentage = (count / MEMBERS.length) * 100;
                    
                    return (
                      <div key={tier.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${tier.color}`}></div>
                            <span>{tier.name}</span>
                          </div>
                          <span>{count} участников ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${tier.color} transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Points Activity */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-6">Активность баллов</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Начислено за месяц', value: '8,450', trend: '+12%' },
                    { label: 'Списано за месяц', value: '3,210', trend: '+8%' },
                    { label: 'Средний баланс', value: '1,234', trend: '+5%' },
                    { label: 'Конверсия в списание', value: '38%', trend: '+3%' },
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                      <span className="text-sm text-gray-400">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{metric.value}</span>
                        <span className="text-green-400 text-xs">{metric.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Points Management Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Управление баллами</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold mb-2">{selectedMember.name}</h3>
                <div className="text-sm text-gray-400">
                  Текущий баланс: <span className="text-white font-semibold">{selectedMember.points.toLocaleString()} баллов</span>
                </div>
                <div className="text-sm text-gray-400">
                  Уровень: <span className="text-white">{selectedMember.tier}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Действие</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPointsAction('add')}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        pointsAction === 'add'
                          ? 'bg-green-500 text-white'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Начислить
                    </button>
                    <button
                      onClick={() => setPointsAction('subtract')}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        pointsAction === 'subtract'
                          ? 'bg-red-500 text-white'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Списать
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Количество баллов</label>
                  <input
                    type="number"
                    value={pointsAmount}
                    onChange={(e) => setPointsAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Введите количество"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Причина</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Обоснование операции"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handlePointsAction}
                  disabled={!pointsAmount}
                  className="flex-1 bg-purple-500 text-white rounded-lg py-3 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}