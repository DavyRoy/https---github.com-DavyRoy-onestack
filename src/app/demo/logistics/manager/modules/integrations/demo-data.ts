export const inventoryDemoData = {
  audits: [
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
  ]
};