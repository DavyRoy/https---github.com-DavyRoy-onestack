export interface BookingSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  serviceId: string;
  employeeId?: string;
  price: number;
}

export interface BookingService {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  description: string;
}

export interface BookingEmployee {
  id: string;
  name: string;
  position: string;
  services: string[];
}

export interface BookingFormData {
  serviceId: string;
  employeeId?: string;
  date: string;
  timeSlotId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
}

export interface BookingRules {
  minAdvanceNotice: number; // hours
  maxAdvanceBooking: number; // days
  cancellationDeadline: number; // hours
  depositRequired: boolean;
  depositAmount?: number;
}