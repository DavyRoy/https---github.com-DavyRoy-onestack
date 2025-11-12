export interface WarehouseItem {
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  batch?: string;
  expiryDate?: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'out_of_stock' | 'overstock';
}

export interface StockMovement {
  id: string;
  sku: string;
  type: 'in' | 'out' | 'transfer';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason: string;
  date: string;
  user: string;
}