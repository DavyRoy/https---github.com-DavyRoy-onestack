export interface DemoOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  fromAddress: string;
  toAddress: string;
  cargoType: string;
  weight: number;
  volume: number;
  deliveryWindow: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
  cost: number;
  insurance: boolean;
  doorDelivery: boolean;
}

export interface DeliveryTracking {
  orderId: string;
  courierName: string;
  courierPhone: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  checkpoints: {
    time: string;
    location: string;
    status: string;
    description: string;
  }[];
  estimatedArrival: string;
  progress: number;
}

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
}

export interface CourierRoute {
  courierId: string;
  courierName: string;
  vehicle: string;
  status: 'available' | 'on_route' | 'break' | 'offline';
  currentLocation: { lat: number; lng: number };
  route: {
    orderId: string;
    address: string;
    customer: string;
    phone: string;
    status: 'pending' | 'arrived' | 'delivered';
    estimatedTime: string;
    sequence: number;
  }[];
  totalStops: number;
  completedStops: number;
}

export interface Document {
  id: string;
  type: 'ttn' | 'invoice' | 'act';
  orderId: string;
  number: string;
  date: string;
  sender: string;
  receiver: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
    weight?: number;
  }[];
  totalWeight: number;
  barcode: string;
  status: 'draft' | 'issued' | 'signed';
}

export interface InventoryAudit {
  id: string;
  zone: string;
  auditor: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  items: {
    sku: string;
    name: string;
    expected: number;
    counted: number;
    difference: number;
    resolved: boolean;
  }[];
}

export interface LogisticsReport {
  period: string;
  shipments: number;
  deliveries: number;
  returns: number;
  damages: number;
  onTimeRate: number;
  averageDeliveryTime: number;
  revenue: number;
  costs: number;
}

export interface DeliveryAnalytics {
  date: string;
  totalDeliveries: number;
  onTime: number;
  late: number;
  averageTime: number;
  p90Time: number;
  region: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'system' | 'alert';
  title: string;
  message: string;
  channel: 'push' | 'email' | 'sms';
  sent: boolean;
  read: boolean;
  createdAt: string;
  recipient?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: '1c' | 'erp' | 'crm';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  syncStatus: 'success' | 'warning' | 'error';
  recordsProcessed: number;
  errors: string[];
}