export const integrationsDemoData = {
  integrations: [
    {
      id: '1',
      name: '1C:Предприятие',
      type: '1c',
      status: 'connected',
      lastSync: '2024-01-15T16:30:00Z',
      syncStatus: 'success',
      recordsProcessed: 145,
      errors: [],
      settings: {
        url: 'https://1c.company.com/ws/odata',
        frequency: 'realtime',
        autoSync: true
      }
    },
    {
      id: '2',
      name: 'ERP System Pro',
      type: 'erp',
      status: 'connected',
      lastSync: '2024-01-15T15:45:00Z',
      syncStatus: 'warning',
      recordsProcessed: 89,
      errors: ['3 записи не обработаны'],
      settings: {
        url: 'https://erp.company.com/api/v2',
        frequency: 'hourly',
        autoSync: true
      }
    }
  ],
  syncLogs: [
    {
      id: '1',
      integrationId: '1',
      timestamp: '2024-01-15T16:30:00Z',
      status: 'success',
      recordsProcessed: 145,
      duration: 45
    }
  ]
};