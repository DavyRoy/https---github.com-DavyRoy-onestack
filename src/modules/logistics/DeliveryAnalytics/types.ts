export interface DeliveryMetrics {
  date: string;
  totalDeliveries: number;
  onTime: number;
  late: number;
  averageTime: number;
  p90Time: number;
  region: string;
  courierId?: string;
}

export interface TimeAnalysis {
  period: string;
  metrics: {
    label: string;
    value: number;
    change: number;
    target: number;
  }[];
}

export interface RegionPerformance {
  region: string;
  totalDeliveries: number;
  onTimeRate: number;
  averageTime: number;
  satisfaction: number;
}