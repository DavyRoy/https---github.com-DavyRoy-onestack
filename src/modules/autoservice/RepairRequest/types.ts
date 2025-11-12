export interface RepairRequest {
  id: string;
  carBrand: string;
  carModel: string;
  licensePlate: string;
  year: number;
  mileage: number;
  problemType: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  contactPhone: string;
  contactEmail?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface RepairRequestFormData {
  carBrand: string;
  carModel: string;
  licensePlate: string;
  year: string;
  mileage: string;
  problemType: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  contactPhone: string;
  contactEmail: string;
}