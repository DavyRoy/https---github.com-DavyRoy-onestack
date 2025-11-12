export interface DeliveryTask {
  id: string;
  orderId: string;
  address: string;
  customer: string;
  phone: string;
  instructions?: string;
  status: 'pending' | 'arrived' | 'completed' | 'cancelled';
  estimatedTime: string;
  actualTime?: string;
  sequence: number;
  coordinates: { lat: number; lng: number };
  proofImage?: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'available' | 'on_route' | 'break' | 'offline';
  currentRoute: DeliveryTask[];
  completedToday: number;
  rating: number;
}