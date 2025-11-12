'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  image?: string;
  badges: string[];
}

const CATEGORIES = ['Все', 'Парикмахерская', 'Ногтевой сервис', 'Уход', 'Массаж'];
const MOCK_ITEMS: CatalogItem[] = [
  {
    id: '1',
    name: 'Стрижка мужская',
    category: 'Парикмахерская',
    price: 1500,
    description: 'Классическая мужская стрижка с укладкой',
    available: true,
    badges: ['Хит']
  },
  {
    id: '2',
    name: 'Стрижка женская',
    category: 'Парикмахерская',
    price: 2500,
    description: 'Женская стрижка с консультацией стилиста',
    available: true,
    badges: ['Новая']
  },
  {
    id: '3',
    name: 'Маникюр классический',
    category: 'Ногтевой сервис',
    price: 1200,
    description: 'Обрезной маникюр с покрытием',
    available: true,
    badges: []
  },
  {
    id: '4',
    name: 'Спа-процедура',
    category: 'Уход',
    price: 3500,
    description: 'Комплексный уход с массажем',
    available: false,
    badges: ['-20%']
  },
];

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const filteredItems = MOCK_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <h1 className="text-xl font-semibold">Меню / Прайс / Афиша</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Экспорт
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Фильтр
              </button>
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-green-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-600 transition-colors"
              >
                + Создать
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Помощь
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{MOCK_ITEMS.length}</div>
            <div className="text-sm text-gray-400">Всего позиций</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{MOCK_ITEMS.filter(i => i.available).length}</div>
            <div className="text-sm text-gray-400">Доступно</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">
              {Math.round(MOCK_ITEMS.reduce((sum, item) => sum + item.price, 0) / MOCK_ITEMS.length)} ₽
            </div>
            <div className="text-sm text-gray-400">Средняя цена</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{CATEGORIES.length - 1}</div>
            <div className="text-sm text-gray-400">Категорий</div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="space-y-4">
                {/* Image Placeholder */}
                <div className="aspect-square bg-white/5 rounded-xl flex items-center justify-center">
                  <div className="text-4xl opacity-30">
                    {item.category === 'Парикмахерская' ? '💇' : 
                     item.category === 'Ногтевой сервис' ? '💅' : 
                     item.category === 'Уход' ? '🧖' : '💆'}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                    <div className="flex gap-1">
                      {item.badges.map((badge) => (
                        <span
                          key={badge}
                          className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{item.price} ₽</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.available 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {item.available ? 'Доступно' : 'Недоступно'}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1 inline-block">
                    {item.category}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                    Редактировать
                  </button>
                  <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                    Дублировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-30">📋</div>
            <h3 className="text-xl font-semibold mb-2">Позиции не найдены</h3>
            <p className="text-gray-400 mb-6">
              Попробуйте изменить параметры поиска или создать новую позицию
            </p>
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-green-500 text-white rounded-xl px-6 py-3 hover:bg-green-600 transition-colors"
            >
              + Создать первую позицию
            </button>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Создать позицию</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Название</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Название услуги..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Категория</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                  {CATEGORIES.filter(c => c !== 'Все').map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Цена</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setIsCreating(false)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 hover:bg-white/10 transition-colors"
              >
                Отмена
              </button>
              <button className="flex-1 bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition-colors">
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}