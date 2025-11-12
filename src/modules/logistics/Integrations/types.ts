export interface Integration {
  id: string;
  name: string;
  type: '1c' | 'erp' | 'crm' | 'marketplace' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  syncStatus: 'success' | 'warning' | 'error';
  recordsProcessed: number;
  errors: string[];
  settings: {
    url: string;
    apiKey?: string;
    frequency: 'realtime' | 'hourly' | 'daily' | 'manual';
    autoSync: boolean;
  };
}

export interface SyncLog {
  id: string;
  integrationId: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  recordsProcessed: number;
  duration: number;
  error?: string;
}