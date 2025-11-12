'use client';

import React, { useState, useMemo } from 'react';

// Mock данные
const mockAudits: InventoryAudit[] = [
  {
    id: '1',
    name: 'Инвентаризация Зона A',
    zone: 'Зона A',
    auditor: 'Иван Сидоров',
    startTime: '2024-01-15T09:00:00Z',
    status: 'in_progress',
    totalItems: 45,
    countedItems: 28,
    discrepancies: 3,
    items: [
      {
        sku: 'SKU-001',
        name: 'Картонная коробка 30x30x30',
        category: 'Упаковка',
        location: 'A-1',
        expected: 50,
        counted: 45,
        difference: -5,
        status: 'counted'
      },
      {
        sku: 'SKU-002',
        name: 'Стрейч-плёнка 500мм',
        category: 'Упаковка',
        location: 'A-2',
        expected: 20,
        counted: 12,
        difference: -8,
        status: 'discrepancy'
      }
    ]
  }
];

function AuditProgress({ audit }: { audit: InventoryAudit }) {
  const progress = (audit.countedItems / audit.totalItems) * 100;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{audit.name}</h3>
        <span className={`
          px-3 py-1 rounded-full text-sm font-medium
          ${audit.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' : ''}
          ${audit.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
          ${audit.status === 'planned' ? 'bg-blue-500/20 text-blue-400' : ''}
        `}>
          {audit.status === 'in_progress' && 'В процессе'}
          {audit.status === 'completed' && 'Завершена'}
          {audit.status === 'planned' && 'Запланирована'}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Прогресс</span>
            <span>{audit.countedItems} / {audit.totalItems} ({Math.round(progress)}%)</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{audit.totalItems}</div>
            <div className="text-sm text-gray-400">Всего</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{audit.countedItems}</div>
            <div className="text-sm text-gray-400">Посчитано</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{audit.discrepancies}</div>
            <div className="text-sm text-gray-400">Расхождения</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white">
            Продолжить подсчёт
          </button>
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditItem({ item, onUpdate }: { item: AuditItem; onUpdate: (sku: string, counted: number) => void }) {
  const [counted, setCounted] = useState(item.counted);

  const handleCountChange = (newCount: number) => {
    setCounted(newCount);
    onUpdate(item.sku, newCount);
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="font-semibold text-white">{item.name}</div>
          <div className="text-sm text-gray-400">
            {item.sku} • {item.location} • {item.category}
          </div>
        </div>
        <div className={`
          px-2 py-1 rounded-full text-xs
          ${item.status === 'counted' ? 'bg-green-500/20 text-green-400' : ''}
          ${item.status === 'discrepancy' ? 'bg-red-500/20 text-red-400' : ''}
          ${item.status === 'pending' ? 'bg-gray-500/20 text-gray-400' : ''}
        `}>
          {item.status === 'counted' && 'Посчитано'}
          {item.status === 'discrepancy' && 'Расхождение'}
          {item.status === 'pending' && 'Ожидает'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="text-center">
          <div className="text-sm text-gray-400">Ожидаемо</div>
          <div className="text-lg font-semibold text-white">{item.expected}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Фактически</div>
          <div className="text-lg font-semibold text-blue-400">{item.counted}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Разница</div>
          <div className={`text-lg font-semibold ${
            item.difference === 0 ? 'text-green-400' : 
            item.difference > 0 ? 'text-blue-400' : 'text-red-400'
          }`}>
            {item.difference > 0 ? '+' : ''}{item.difference}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleCountChange(Math.max(0, counted - 1))}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          -
        </button>
        
        <input
          type="number"
          value={counted}
          onChange={(e) => handleCountChange(parseInt(e.target.value) || 0)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center"
        />
        
        <button
          onClick={() => handleCountChange(counted + 1)}
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          +
        </button>

        <button className="px-3 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
          ✓
        </button>
      </div>
    </div>
  );
}

function DiscrepanciesList({ audit }: { audit: InventoryAudit }) {
  const discrepancies = audit.items.filter(item => item.difference !== 0);

  if (discrepancies.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Расхождения</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-gray-400">Расхождений не обнаружено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Расхождения ({discrepancies.length})
      </h3>
      <div className="space-y-3">
        {discrepancies.map(item => (
          <div key={item.sku} className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div>
              <div className="font-medium text-white">{item.name}</div>
              <div className="text-sm text-gray-400">{item.sku}</div>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-semibold">
                {item.difference > 0 ? '+' : ''}{item.difference}
              </div>
              <div className="text-sm text-gray-400">
                {item.expected} → {item.counted}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 mt-4">
        <button className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-white">
          Создать акт списания
        </button>
        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
          Игнорировать
        </button>
      </div>
    </div>
  );
}

export default function InventoryAudit() {
  const [audits, setAudits] = useState(mockAudits);
  const [selectedAudit, setSelectedAudit] = useState(mockAudits[0]);
  const [view, setView] = useState<'progress' | 'items' | 'discrepancies'>('progress');

  const handleItemUpdate = (sku: string, counted: number) => {
    setAudits(prev => prev.map(audit => ({
      ...audit,
      items: audit.items.map(item => 
        item.sku === sku 
          ? { 
              ...item, 
              counted,
              difference: counted - item.expected,
              status: counted === item.expected ? 'counted' : 'discrepancy'
            }
          : item
      ),
      countedItems: audit.items.filter(item => item.counted > 0).length,
      discrepancies: audit.items.filter(item => item.counted !== item.expected).length
    })));
  };

  const activeAudits = audits.filter(a => a.status === 'in_progress');
  const completedAudits = audits.filter(a => a.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Инвентаризация</h1>
          <p className="text-gray-400 mt-2">Учёт и сверка складских остатков</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white">
            + Новая инвентаризация
          </button>
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
            📋 Шаблоны
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{audits.length}</div>
          <div className="text-sm text-gray-400">Всего проверок</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-yellow-400">{activeAudits.length}</div>
          <div className="text-sm text-gray-400">Активные</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{completedAudits.length}</div>
          <div className="text-sm text-gray-400">Завершённые</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-red-400">
            {audits.reduce((acc, audit) => acc + audit.discrepancies, 0)}
          </div>
          <div className="text-sm text-gray-400">Всего расхождений</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Audit List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Активные проверки</h3>
          <div className="space-y-3">
            {activeAudits.map(audit => (
              <div
                key={audit.id}
                onClick={() => setSelectedAudit(audit)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedAudit.id === audit.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="font-semibold text-white">{audit.name}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {audit.zone} • {audit.auditor}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-400">
                    {audit.countedItems}/{audit.totalItems}
                  </div>
                  <div className="text-xs text-red-400">
                    {audit.discrepancies} расхождений
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h4 className="font-semibold text-white mb-3">Быстрые действия</h4>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm">
                📱 Сканирование штрих-кодов
              </button>
              <button className="w-full px-3 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm">
                📄 Импорт данных
              </button>
              <button className="w-full px-3 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm">
                📊 Отчёт по инвентаризации
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* View Tabs */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setView('progress')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                view === 'progress' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Обзор
            </button>
            <button
              onClick={() => setView('items')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                view === 'items' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Позиции ({selectedAudit.items.length})
            </button>
            <button
              onClick={() => setView('discrepancies')}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                view === 'discrepancies' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Расхождения ({selectedAudit.discrepancies})
            </button>
          </div>

          {/* View Content */}
          {view === 'progress' && <AuditProgress audit={selectedAudit} />}
          
          {view === 'items' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Позиции для подсчёта</h3>
              <div className="grid grid-cols-1 gap-4">
                {selectedAudit.items.map(item => (
                  <AuditItem
                    key={item.sku}
                    item={item}
                    onUpdate={handleItemUpdate}
                  />
                ))}
              </div>
            </div>
          )}
          
          {view === 'discrepancies' && <DiscrepanciesList audit={selectedAudit} />}
        </div>
      </div>
    </div>
  );
}