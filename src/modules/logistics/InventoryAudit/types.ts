export interface InventoryAudit {
  id: string;
  name: string;
  zone: string;
  auditor: string;
  startTime: string;
  endTime?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  items: AuditItem[];
  totalItems: number;
  countedItems: number;
  discrepancies: number;
}

export interface AuditItem {
  sku: string;
  name: string;
  category: string;
  location: string;
  expected: number;
  counted: number;
  difference: number;
  status: 'pending' | 'counted' | 'verified' | 'discrepancy';
  notes?: string;
}