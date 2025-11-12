export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  image?: string;
  rating: number;
  experience: number;
  description: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
}

export interface AppointmentFormData {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  slotId: string;
  symptoms: string;
  priority: 'routine' | 'urgent';
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  address: string;
  patientName: string;
}