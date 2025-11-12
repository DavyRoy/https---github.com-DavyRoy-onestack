'use client';

import React, { useState } from 'react';

interface Part {
  id: string;
  sku: string;
  name: string;
  brand: string;
  carModel: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const PARTS_CATEGORIES = [
  'Все',
  'Двигатель',
  'Трансмиссия', 
  'Подвеска',
  'Тормоза',
  'Электрика',
  'Кузов',
  'Фильтры',
  'Масла'
];

const SAMPLE_PARTS: Part[] = [
  {
    id: '1',
    sku: 'FILT-OIL-001',
    name: 'Масляный фильтр',
    brand: 'Mann-Filter',
    carModel: 'BMW X5 F15',
    category: 'Фильтры',
    stock: 12,
    minStock: 5,
    price: 2450,
    location: 'A-12-4',
    status: 'in_stock'
  },
  {
    id: '2',
    sku: 'BRAKE-PAD-002',
    name: 'Тормозные колодки',
    brand: 'Brembo',
    carModel: 'Audi Q7',
    category: 'Тормоза',
    stock: 3,
    minStock: 6,
    price: 12400,
    location: 'B-08-2',
    status: 'low_stock'
  },
  {
    id: '3',
    sku: 'SPARK-003',
    name: 'Свечи зажигания',
    brand: 'NGK',
    carModel: 'Toyota Camry',
    category: 'Двигатель',
    stock: 0,
    minStock: 8,
    price: 3200,
    location: 'C-15-7',
    status: 'out_of_stock'
  },
  {
    id: '4',
    sku: 'SUSP-004',
    name: 'Амортизатор передний',
    brand: 'Bilstein',
    carModel: 'Mercedes GLE',
    category: 'Подвеска',
    stock: 8,
    minStock: 4,
    price: 18500,
    location: 'D-03-1',
    status: 'in_stock'
  },
  {
    id: '5',
    sku: 'BATT-005',
    name: 'Аккумулятор',
    brand: 'Varta',
    carModel: 'Все модели',
    category: 'Электрика',
    stock: 2,
    minStock: 5,
    price: 8900,
    location: 'E-11-3',
    status: 'low_stock'
  }
];

export default function PartsManagement() {
  const [parts] = useState<Part[]>(SAMPLE_PARTS);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const filteredParts = parts.filter(part => {
    const matchesCategory = selectedCategory === 'Все' || part.category === selectedCategory;
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const togglePartSelection = (partId: string) => {
    setSelectedParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const getStatusColor = (status: Part['status']) => {
    switch (status) {
      case 'in_stock': return 'bg-green-500/20 text-green-300';
      case 'low_stock': return 'bg-orange-500/20 text-orange-300';
      case 'out_of_stock': return 'bg-red-500/20 text-red-300';
    }
  };

  const getStatusText = (status: Part['status']) => {
    switch (status) {
      case 'in_stock': return 'В наличии';
      case 'low_stock': return 'Мало';
      case 'out_of_stock': return 'Нет';
    }
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Поиск по названию, артикулу, бренду..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-white/30 placeholder-white/30"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              🔍
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
          >
            {PARTS_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
            📋 Импорт
          </button>
          <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
            ➕ Добавить
          </button>
        </div>
      </div>

      {/* Parts Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">
                <input type="checkbox" className="rounded border-white/20 bg-white/5" />
              </th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Артикул</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Название</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Бренд</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Авто</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Категория</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Остаток</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Цена</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Статус</th>
              <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredParts.map((part) => (
              <tr 
                key={part.id}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedParts.includes(part.id)}
                    onChange={() => togglePartSelection(part.id)}
                    className="rounded border-white/20 bg-white/5"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-mono text-sm text-white/80">{part.sku}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-white">{part.name}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-white/80">{part.brand}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-white/60 text-sm">{part.carModel}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-white/5 text-white/60">
                    {part.category}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="text-white/80">{part.stock} шт</div>
                    {part.stock < part.minStock && (
                      <span className="text-xs text-orange-400">мин: {part.minStock}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-white/80">{part.price.toLocaleString()} ₽</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(part.status)}`}>
                    {getStatusText(part.status)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button 
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Резерв"
                    >
                      📋
                    </button>
                    <button 
                      className="p-1 text-green-400 hover:text-green-300 transition-colors"
                      title="Приход"
                    >
                      📥
                    </button>
                    <button 
                      className="p-1 text-orange-400 hover:text-orange-300 transition-colors"
                      title="Списание"
                    >
                      📤
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredParts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-white/60">Запчасти не найдены</p>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedParts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <span className="text-white text-sm">
              Выбрано: {selectedParts.length} запчастей
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
                Массовый резерв
              </button>
              <button className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                Массовый приход
              </button>
              <button className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}