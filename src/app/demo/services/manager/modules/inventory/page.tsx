'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  cost: number;
  price: number;
  supplier: string;
  lastRestocked: string;
  critical: boolean;
}

interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  user: string;
}

const INVENTORY_ITEMS: InventoryItem[] = [
  { id: '1', name: 'Шампунь профессиональный', category: 'Расходники', sku: 'SHAMP-001', currentStock: 12, minStock: 5, maxStock: 50, cost: 450, price: 850, supplier: 'BeautyPro', lastRestocked: '2024-11-10', critical: false },
  { id: '2', name: 'Крем для лица', category: 'Косметика', sku: 'CREAM-002', currentStock: 8, minStock: 10, maxStock: 30, cost: 320, price: 650, supplier: 'SkinCare Inc', lastRestocked: '2024-11-08', critical: true },
  { id: '3', name: 'Лак для ногтей', category: 'Маникюр', sku: 'NAIL-003', currentStock: 45, minStock: 20, maxStock: 100, cost: 120, price: 250, supplier: 'NailArt', lastRestocked: '2024-11-12', critical: false },
  { id: '4', name: 'Расческа профессиональная', category: 'Инструменты', sku: 'COMB-004', currentStock: 3, minStock: 5, maxStock: 15, cost: 280, price: 550, supplier: 'HairTools', lastRestocked: '2024-11-05', critical: true },
  { id: '5', name: 'Маска для волос', category: 'Уход', sku: 'MASK-005', currentStock: 25, minStock: 15, maxStock: 60, cost: 180, price: 350, supplier: 'BeautyPro', lastRestocked: '2024-11-14', critical: false },
];

const STOCK_MOVEMENTS: StockMovement[] = [
  { id: '1', itemId: '1', type: 'in', quantity: 20, reason: 'Закупка', date: '2024-11-10', user: 'Анна Смирнова' },
  { id: '2', itemId: '2', type: 'out', quantity: 5, reason: 'Продажа', date: '2024-11-11', user: 'Мария Иванова' },
  { id: '3', itemId: '3', type: 'in', quantity: 50, reason: 'Закупка', date: '2024-11-12', user: 'Анна Смирнова' },
  { id: '4', itemId: '1', type: 'out', quantity: 8, reason: 'Расход', date: '2024-11-13', user: 'Елена Петрова' },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'items' | 'movements' | 'suppliers'>('items');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockAction, setStockAction] = useState<'in' | 'out' | 'adjustment'>('in');
  const [stockQuantity, setStockQuantity] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  const filteredItems = showLowStock 
    ? INVENTORY_ITEMS.filter(item => item.currentStock <= item.minStock)
    : INVENTORY_ITEMS;

  const handleStockAction = () => {
    if (!selectedItem || !stockQuantity) return;
    
    // Mock stock action
    alert(`${stockAction === 'in' ? 'Поступление' : stockAction === 'out' ? 'Списание' : 'Корректировка'} ${stockQuantity} единиц для ${selectedItem.name}`);
    setSelectedItem(null);
    setStockQuantity('');
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'critical';
    if (item.currentStock <= item.minStock * 1.5) return 'low';
    return 'normal';
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
              <h1 className="text-xl font-semibold">Склад и инвентарь</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Импорт CSV
              </button>
              <button className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors">
                Экспорт
              </button>
              <button className="bg-green-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-600 transition-colors">
                + Товар
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
            { id: 'items', label: 'Товары', count: INVENTORY_ITEMS.length },
            { id: 'movements', label: 'Движения', count: STOCK_MOVEMENTS.length },
            { id: 'suppliers', label: 'Поставщики' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 pb-4 px-6 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-white'
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
            <div className="text-2xl font-bold">{INVENTORY_ITEMS.length}</div>
            <div className="text-sm text-gray-400">Всего позиций</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold text-red-400">
              {INVENTORY_ITEMS.filter(item => item.currentStock <= item.minStock).length}
            </div>
            <div className="text-sm text-gray-400">Критический остаток</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {INVENTORY_ITEMS.reduce((sum, item) => sum + item.currentStock * item.cost, 0).toLocaleString()} ₽
            </div>
            <div className="text-sm text-gray-400">Стоимость запасов</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-gray-400">Поставщиков</div>
          </div>
        </div>

        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Управление товарами</h2>
              
              <div className="flex gap-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLowStock}
                    onChange={(e) => setShowLowStock(e.target.checked)}
                    className="rounded bg-white/5 border-white/10"
                  />
                  <span className="text-sm">Только низкие остатки</span>
                </label>
                
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Все категории</option>
                  <option>Расходники</option>
                  <option>Косметика</option>
                  <option>Маникюр</option>
                  <option>Инструменты</option>
                  <option>Уход</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Товар</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Категория</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Артикул</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Остаток</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Мин.</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Стоимость</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Статус</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const status = getStockStatus(item);
                      
                      return (
                        <tr key={item.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <div className="font-semibold">{item.name}</div>
                              <div className="text-sm text-gray-400">{item.supplier}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm bg-white/10 rounded-full px-2 py-1">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm font-mono">{item.sku}</td>
                          <td className="py-4 px-6 text-right font-semibold">
                            {item.currentStock}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-gray-400">
                            {item.minStock}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="font-semibold">{item.price} ₽</div>
                            <div className="text-sm text-gray-400">{item.cost} ₽ себ.</div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                              status === 'critical'
                                ? 'bg-red-500/20 text-red-300'
                                : status === 'low'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                status === 'critical' ? 'bg-red-400' :
                                status === 'low' ? 'bg-yellow-400' : 'bg-green-400'
                              }`}></div>
                              <span>
                                {status === 'critical' ? 'Критично' :
                                 status === 'low' ? 'Низкий' : 'Норма'}
                              </span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm hover:bg-white/10 transition-colors"
                            >
                              Действия
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-30">📦</div>
                <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
                <p className="text-gray-400">
                  Попробуйте изменить параметры фильтрации
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'movements' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Движение товаров</h2>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Дата</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Товар</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Тип</th>
                      <th className="text-right py-4 px-6 text-sm font-semibold text-gray-400">Количество</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Причина</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-400">Пользователь</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STOCK_MOVEMENTS.map((movement) => {
                      const item = INVENTORY_ITEMS.find(i => i.id === movement.itemId);
                      
                      return (
                        <tr key={movement.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 text-sm">{movement.date}</td>
                          <td className="py-4 px-6">
                            <div className="font-semibold">{item?.name}</div>
                            <div className="text-sm text-gray-400">{item?.sku}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                              movement.type === 'in'
                                ? 'bg-green-500/20 text-green-300'
                                : movement.type === 'out'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              <span>
                                {movement.type === 'in' ? 'Поступление' :
                                 movement.type === 'out' ? 'Списание' : 'Корректировка'}
                              </span>
                            </span>
                          </td>
                          <td className={`py-4 px-6 text-right font-semibold ${
                            movement.type === 'in' ? 'text-green-400' :
                            movement.type === 'out' ? 'text-red-400' : 'text-blue-400'
                          }`}>
                            {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{movement.quantity}
                          </td>
                          <td className="py-4 px-6 text-sm">{movement.reason}</td>
                          <td className="py-4 px-6 text-sm text-gray-400">{movement.user}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Поставщики</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'BeautyPro', contact: 'Иван Петров', email: 'ivan@beautypro.ru', phone: '+7 999 111-22-33', items: 12, rating: 4.8 },
                { name: 'SkinCare Inc', contact: 'Мария Сидорова', email: 'maria@skincare.ru', phone: '+7 999 222-33-44', items: 8, rating: 4.5 },
                { name: 'NailArt', contact: 'Алексей Козлов', email: 'alex@nailart.ru', phone: '+7 999 333-44-55', items: 15, rating: 4.9 },
                { name: 'HairTools', contact: 'Елена Васнецова', email: 'elena@hairtools.ru', phone: '+7 999 444-55-66', items: 6, rating: 4.2 },
              ].map((supplier, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{supplier.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>★ {supplier.rating}</span>
                        <span>•</span>
                        <span>{supplier.items} товаров</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Контакт:</span>
                        <span>{supplier.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Телефон:</span>
                        <span>{supplier.phone}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                        Заказ
                      </button>
                      <button className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 text-sm hover:bg-white/10 transition-colors">
                        Контакты
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Stock Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Операция с товаром</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="font-semibold mb-2">{selectedItem.name}</h3>
                <div className="text-sm text-gray-400">
                  Текущий остаток: <span className="text-white font-semibold">{selectedItem.currentStock} ед.</span>
                </div>
                <div className="text-sm text-gray-400">
                  Артикул: <span className="font-mono">{selectedItem.sku}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Тип операции</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'in', label: 'Поступление', color: 'green' },
                      { id: 'out', label: 'Списание', color: 'red' },
                      { id: 'adjustment', label: 'Корректировка', color: 'blue' },
                    ].map((action) => (
                      <button
                        key={action.id}
                        onClick={() => setStockAction(action.id as any)}
                        className={`flex-1 py-2 rounded-lg transition-colors ${
                          stockAction === action.id
                            ? `bg-${action.color}-500 text-white`
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Количество</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Введите количество"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Причина</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Закупка</option>
                    <option>Продажа</option>
                    <option>Расход</option>
                    <option>Возврат</option>
                    <option>Инвентаризация</option>
                    <option>Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Комментарий</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Дополнительная информация..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg py-3 hover:bg-white/10 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleStockAction}
                  disabled={!stockQuantity}
                  className="flex-1 bg-green-500 text-white rounded-lg py-3 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
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