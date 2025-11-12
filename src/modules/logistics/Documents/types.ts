export interface Document {
  id: string;
  type: 'ttn' | 'invoice' | 'act' | 'waybill';
  orderId: string;
  number: string;
  date: string;
  sender: {
    name: string;
    address: string;
    phone: string;
    inn?: string;
  };
  receiver: {
    name: string;
    address: string;
    phone: string;
    inn?: string;
  };
  items: DocumentItem[];
  totalWeight: number;
  totalValue?: number;
  barcode: string;
  status: 'draft' | 'issued' | 'signed';
  notes?: string;
}

export interface DocumentItem {
  name: string;
  quantity: number;
  unit: string;
  weight?: number;
  value?: number;
  description?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: Document['type'];
  fields: string[];
  defaultValues: Partial<Document>;
}