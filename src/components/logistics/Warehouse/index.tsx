'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockWarehouseItems: WarehouseItem[] = [
  {
    sku: 'SKU-001',
    name: 'Картонная коробка 30x30x30',
    category: 'Упаковка',
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    unit: 'шт',
    location: 'Зона A-1',
    lastUpdated: '2024-01-15T08:00:00Z',
    status: 'low'
  },
  {
    sku: 'SKU-002',
    name: 'Стрейч-плёнка 500мм',
    category: 'Упаковка',
    currentStock: 12,
    minStock: 20,
    maxStock: 100,
    unit: 'рулон',
    location: 'Зона A-2',
    lastUpdated: '2024-01-15T09:30:00Z',
    status: 'low'
  },
  {
    sku: 'SKU-003',
    name: 'Сканер штрих-кодов',
    category: 'Оборудование',
    currentStock: 8,
    minStock: 5,
    maxStock: 15,
    unit: 'шт',
    location: 'Зона B-1',
    lastUpdated: '2024-01-14T16:45:00Z',
    status: 'normal'
  },
  {
    sku: 'SKU-004',
    name: 'Термоэтикетка 100x150',
    category: 'Расходники',
    currentStock: 0,
    minStock: 10,
    maxStock: 50,
    unit: 'пачка',
    location: 'Зона C-3',
    lastUpdated: '2024-01-15T11:20:00Z',
    status: 'out_of_stock'
  },
  {
    sku: 'SKU-005',
    name: 'Паллет деревянный',
    category: 'Тара',
    currentStock: 45,
    minStock: 20,
    maxStock: 50,
    unit: 'шт',
    location: 'Зона D-1',
    lastUpdated: '2024-01-13T14:15:00Z',
    status: 'overstock'
  }
];

function WarehouseTable({ items, onItemEdit }: any) {
  const getStatusBadge = (status: string) => {
    const styles = {
      normal: 'bg-green-500/20 text-green-400',
      low: 'bg-yellow-500/20 text-yellow-400',
      out_of_stock: 'bg-red-500/20 text-red-400',
      overstock: 'bg-blue-500/20 text-blue-400'
    };
    
    const labels = {
      normal: 'Норма',
      low: 'Мало',
      out_of_stock: 'Нет',
      overstock: 'Много'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getStockProgress = (item: WarehouseItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    return {
      percentage,
      color: item.status === 'low' ? 'bg-yellow-500' : 
             item.status === 'out_of_stock' ? 'bg-red-500' :
             item.status === 'overstock' ? 'bg-blue-500' : 'bg-green-500'
    };
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">SKU</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">Название</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">Категория</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">Остаток</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">Локация</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">Статус</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">Прогресс</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-white">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.map((item: WarehouseItem) => {
              const progress = getStockProgress(item);
              
              return (
                <tr key={item.sku} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm text-white">{item.sku}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{item.name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-400">{item.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="text-white font-medium">
                        {item.currentStock} {item.unit}
                      </div>
                      <div className="text-xs text-gray-400">
                        мин: {item.minStock} / макс: {item.maxStock}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-400">{item.location}</span>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${progress.color} transition-all duration-300`}
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onItemEdit(item, 'in')}
                        className="px-3 py-1 text-xs rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        Приход
                      </button>
                      <button
                        onClick={() => onItemEdit(item, 'out')}
                        className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        Расход
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StockMovementModal({ item, movementType, onClose, onSave }: any) {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [location, setLocation] = useState(item?.location || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      sku: item.sku,
      type: movementType,
      quantity,
      reason,
      location: movementType === 'transfer' ? location : undefined,
      date: new Date().toISOString(),
      user: 'current_user'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {movementType === 'in' && 'Приход товара'}
          {movementType === 'out' && 'Расход товара'}
          {movementType === 'transfer' && 'Перемещение товара'}
        </h2>
        
        {item && (
          <div className="mb-4 p-4 rounded-xl bg-white/5">
            <div className="font-semibold text-white">{item.name}</div>
            <div className="text-sm text-gray-400">SKU: {item.sku}</div>
            <div className="text-sm text-gray-400">
              Текущий остаток: {item.currentStock} {item.unit}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Количество
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {movementType === 'transfer' && (
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Новая локация
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Причина
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            >
              <option value="">Выберите причину</option>
              <option value="purchase">Закупка</option>
              <option value="sale">Продажа</option>
              <option value="return">Возврат</option>
              <option value="write_off">Списание</option>
              <option value="transfer">Перемещение</option>
              <option value="other">Другое</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Подтвердить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Warehouse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'transfer' | null>(null);

  const categories = useMemo(() => {
    return [...new Set(mockWarehouseItems.map(item => item.category))];
  }, []);

  const filteredItems = useMemo(() => {
    return mockWarehouseItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: mockWarehouseItems.length,
      lowStock: mockWarehouseItems.filter(item => item.status === 'low').length,
      outOfStock: mockWarehouseItems.filter(item => item.status === 'out_of_stock').length,
      overstock: mockWarehouseItems.filter(item => item.status === 'overstock').length,
    };
  }, []);

  const handleMovement = (item: WarehouseItem, type: 'in' | 'out' | 'transfer') => {
    setSelectedItem(item);
    setMovementType(type);
  };

  const handleSaveMovement = (movement: any) => {
    // Здесь будет логика сохранения движения
    console.log('Сохранение движения:', movement);
    alert(`Движение сохранено: ${movement.type} ${movement.quantity} ${movement.sku}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Управление складом</h1>
          <p className="text-gray-400 mt-2">Контроль остатков и управление номенклатурой</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition-colors text-white">
            Новый товар
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white">
            Импорт
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Всего позиций</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-yellow-400">{stats.lowStock}</div>
          <div className="text-sm text-gray-400">Мало остатков</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-red-400">{stats.outOfStock}</div>
          <div className="text-sm text-gray-400">Нет в наличии</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-blue-400">{stats.overstock}</div>
          <div className="text-sm text-gray-400">Излишки</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Поиск по SKU или названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Все категории</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">Все статусы</option>
          <option value="normal">Норма</option>
          <option value="low">Мало</option>
          <option value="out_of_stock">Нет в наличии</option>
          <option value="overstock">Излишки</option>
        </select>
      </div>

      {/* Table */}
      <WarehouseTable 
        items={filteredItems} 
        onItemEdit={handleMovement}
      />

      {/* Stock Movement Modal */}
      {selectedItem && movementType && (
        <StockMovementModal
          item={selectedItem}
          movementType={movementType}
          onClose={() => {
            setSelectedItem(null);
            setMovementType(null);
          }}
          onSave={handleSaveMovement}
        />
      )}
    </div>
  );
}