export interface DeliveryPoint {
  id: string;
  orderId: string;
  address: string;
  customer: string;
  phone: string;
  status: 'pending' | 'arrived' | 'delivered';
  estimatedTime: string;
  actualTime?: string;
  sequence: number;
  coordinates: { lat: number; lng: number };
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'available' | 'on_route' | 'break' | 'offline';
  currentLocation: { lat: number; lng: number };
  route: DeliveryPoint[];
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}