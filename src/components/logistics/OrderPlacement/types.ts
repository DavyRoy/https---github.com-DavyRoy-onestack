export interface OrderFormData {
  // Отправитель
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  
  // Получатель
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  
  // Груз
  cargoType: string;
  weight: number;
  volume: number;
  description?: string;
  
  // Доставка
  deliveryDate: string;
  deliveryWindow: string;
  urgency: 'standard' | 'express' | 'same_day';
  
  // Услуги
  insurance: boolean;
  insuranceValue?: number;
  doorDelivery: boolean;
  assemblyRequired: boolean;
  
  // Дополнительно
  notes?: string;
}

export interface OrderStepProps {
  data: OrderFormData;
  onChange: (data: OrderFormData) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}