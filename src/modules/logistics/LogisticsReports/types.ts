export interface LogisticsReport {
  id: string;
  period: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  shipments: number;
  deliveries: number;
  returns: number;
  damages: number;
  onTimeRate: number;
  averageDeliveryTime: number;
  revenue: number;
  costs: number;
  profit: number;
  createdBy: string;
  createdAt: string;
}

export interface ReportMetric {
  label: string;
  value: number;
  change: number;
  format: 'number' | 'currency' | 'percentage' | 'time';
}