export const warehouseDemoData = {
  items: [
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
    }
  ],
  categories: ['Упаковка', 'Оборудование', 'Расходники', 'Тара'],
  zones: ['Зона A-1', 'Зона A-2', 'Зона B-1', 'Зона C-3', 'Зона D-1']
};