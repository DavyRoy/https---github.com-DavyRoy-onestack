// src/app/demo/medicine/user/modules/payment/demo-data.ts
export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  services: Service[];
  patientName: string;
  patientId: string;
  appointmentId?: string;
  paymentMethod?: string;
  paidDate?: string;
  description?: string;
  taxAmount?: number;
  discount?: number;
  clinicInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  category?: string;
  duration?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'electronic' | 'insurance';
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  details?: {
    cardNumber?: string;
    expiryDate?: string;
    cardHolder?: string;
    bankName?: string;
    accountNumber?: string;
    walletType?: string;
  };
}

export interface PaymentHistory {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'failed' | 'pending';
  transactionId?: string;
}

export const invoices: Invoice[] = [
  {
    id: 'inv-001',
    number: 'INV-2024-001',
    date: '2024-01-15',
    dueDate: '2024-01-25',
    amount: 2500,
    status: 'paid',
    patientName: 'Иванов Иван Иванович',
    patientId: 'pat-001',
    appointmentId: 'app-001',
    paymentMethod: 'card',
    paidDate: '2024-01-16',
    taxAmount: 250,
    discount: 100,
    clinicInfo: {
      name: 'Медицинский центр "Здоровье+"',
      address: 'г. Москва, ул. Ленина, д. 123',
      phone: '+7 (495) 123-45-67',
      email: 'info@healthplus.ru'
    },
    services: [
      {
        id: 'srv-1',
        name: 'Консультация терапевта',
        description: 'Первичный приём, осмотр, диагностика',
        quantity: 1,
        price: 1500,
        total: 1500,
        category: 'Консультация',
        duration: '30 мин'
      },
      {
        id: 'srv-2',
        name: 'Общий анализ крови',
        description: 'Лабораторное исследование: гемоглобин, лейкоциты, тромбоциты',
        quantity: 1,
        price: 1000,
        total: 1000,
        category: 'Лаборатория'
      }
    ]
  },
  {
    id: 'inv-002',
    number: 'INV-2024-002',
    date: '2024-01-20',
    dueDate: '2024-01-30',
    amount: 3200,
    status: 'pending',
    patientName: 'Иванов Иван Иванович',
    patientId: 'pat-001',
    appointmentId: 'app-002',
    clinicInfo: {
      name: 'Медицинский центр "Здоровье+"',
      address: 'г. Москва, ул. Ленина, д. 123',
      phone: '+7 (495) 123-45-67',
      email: 'info@healthplus.ru'
    },
    services: [
      {
        id: 'srv-3',
        name: 'Консультация кардиолога',
        description: 'Осмотр, ЭКГ, консультация',
        quantity: 1,
        price: 2000,
        total: 2000,
        category: 'Консультация',
        duration: '45 мин'
      },
      {
        id: 'srv-4',
        name: 'Суточный мониторинг АД',
        description: 'Аренда оборудования и анализ',
        quantity: 1,
        price: 1200,
        total: 1200,
        category: 'Диагностика'
      }
    ]
  },
  {
    id: 'inv-003',
    number: 'INV-2024-003',
    date: '2024-01-05',
    dueDate: '2024-01-15',
    amount: 1800,
    status: 'overdue',
    patientName: 'Иванов Иван Иванович',
    patientId: 'pat-001',
    appointmentId: 'app-003',
    clinicInfo: {
      name: 'Медицинский центр "Здоровье+"',
      address: 'г. Москва, ул. Ленина, д. 123',
      phone: '+7 (495) 123-45-67',
      email: 'info@healthplus.ru'
    },
    services: [
      {
        id: 'srv-5',
        name: 'Консультация невролога',
        description: 'Осмотр, неврологическое тестирование',
        quantity: 1,
        price: 1800,
        total: 1800,
        category: 'Консультация',
        duration: '40 мин'
      }
    ]
  },
  {
    id: 'inv-004',
    number: 'INV-2024-004',
    date: '2024-01-28',
    dueDate: '2024-02-07',
    amount: 4500,
    status: 'pending',
    patientName: 'Иванов Иван Иванович',
    patientId: 'pat-001',
    clinicInfo: {
      name: 'Медицинский центр "Здоровье+"',
      address: 'г. Москва, ул. Ленина, д. 123',
      phone: '+7 (495) 123-45-67',
      email: 'info@healthplus.ru'
    },
    services: [
      {
        id: 'srv-6',
        name: 'МРТ шейного отдела',
        description: 'Магнитно-резонансная томография',
        quantity: 1,
        price: 4500,
        total: 4500,
        category: 'Диагностика',
        duration: '60 мин'
      }
    ]
  },
  {
    id: 'inv-005',
    number: 'INV-2024-005',
    date: '2024-02-01',
    dueDate: '2024-02-11',
    amount: 8900,
    status: 'pending',
    patientName: 'Иванов Иван Иванович',
    patientId: 'pat-001',
    clinicInfo: {
      name: 'Медицинский центр "Здоровье+"',
      address: 'г. Москва, ул. Ленина, д. 123',
      phone: '+7 (495) 123-45-67',
      email: 'info@healthplus.ru'
    },
    services: [
      {
        id: 'srv-7',
        name: 'Комплексное обследование',
        description: 'Полный медицинский чекап',
        quantity: 1,
        price: 5000,
        total: 5000,
        category: 'Обследование',
        duration: '120 мин'
      },
      {
        id: 'srv-8',
        name: 'УЗИ брюшной полости',
        description: 'Ультразвуковое исследование',
        quantity: 1,
        price: 2500,
        total: 2500,
        category: 'Диагностика',
        duration: '30 мин'
      },
      {
        id: 'srv-9',
        name: 'Консультация диетолога',
        description: 'Разработка плана питания',
        quantity: 1,
        price: 1400,
        total: 1400,
        category: 'Консультация',
        duration: '50 мин'
      }
    ]
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'card-1',
    type: 'card',
    name: 'Основная карта',
    icon: '💳',
    description: 'Visa •••• 4582',
    isActive: true,
    details: {
      cardNumber: '4582',
      expiryDate: '12/25',
      cardHolder: 'Иван Иванов'
    }
  },
  {
    id: 'card-2',
    type: 'card',
    name: 'Резервная карта',
    icon: '💳',
    description: 'Mastercard •••• 7821',
    isActive: true,
    details: {
      cardNumber: '7821',
      expiryDate: '08/24',
      cardHolder: 'Иван Иванов'
    }
  },
  {
    id: 'bank',
    type: 'bank_transfer',
    name: 'Банковский перевод',
    icon: '🏦',
    description: 'По реквизитам через банк',
    isActive: true
  },
  {
    id: 'yoomoney',
    type: 'electronic',
    name: 'ЮMoney',
    icon: '📱',
    description: 'Электронный кошелек',
    isActive: true
  },
  {
    id: 'insurance',
    type: 'insurance',
    name: 'Страховая компания',
    icon: '🛡️',
    description: 'Оплата через страховку',
    isActive: false
  }
];

export const paymentHistory: PaymentHistory[] = [
  {
    id: 'pay-001',
    invoiceNumber: 'INV-2024-001',
    date: '2024-01-16',
    amount: 2500,
    method: 'card',
    status: 'completed',
    transactionId: 'txn_7s8d9f2g1h'
  },
  {
    id: 'pay-002',
    invoiceNumber: 'INV-2023-045',
    date: '2023-12-10',
    amount: 1800,
    method: 'bank_transfer',
    status: 'completed',
    transactionId: 'txn_3a4b5c6d7e'
  },
  {
    id: 'pay-003',
    invoiceNumber: 'INV-2023-038',
    date: '2023-11-25',
    amount: 3200,
    method: 'electronic',
    status: 'completed',
    transactionId: 'txn_8h9i0j1k2l'
  },
  {
    id: 'pay-004',
    invoiceNumber: 'INV-2023-029',
    date: '2023-10-15',
    amount: 5400,
    method: 'card',
    status: 'completed',
    transactionId: 'txn_4m5n6o7p8q'
  },
  {
    id: 'pay-005',
    invoiceNumber: 'INV-2023-022',
    date: '2023-09-08',
    amount: 2100,
    method: 'card',
    status: 'completed',
    transactionId: 'txn_9r0s1t2u3v'
  },
  {
    id: 'pay-006',
    invoiceNumber: 'INV-2023-015',
    date: '2023-08-20',
    amount: 3800,
    method: 'electronic',
    status: 'completed',
    transactionId: 'txn_5w6x7y8z9a'
  }
];