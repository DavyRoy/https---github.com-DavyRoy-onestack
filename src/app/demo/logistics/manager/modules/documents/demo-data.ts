export const documentsDemoData = {
  documents: [
    {
      id: '1',
      type: 'ttn',
      orderId: 'ORD-001',
      number: 'TTN-2024-001',
      date: '2024-01-15',
      sender: {
        name: 'ООО "Логистик Групп"',
        address: 'Москва, ул. Промышленная, д. 15',
        phone: '+7 495 123-45-67',
        inn: '7712345678'
      },
      receiver: {
        name: 'Иван Петров',
        address: 'Москва, ул. Арбат, д. 25, кв. 5',
        phone: '+7 912 345-67-89'
      },
      items: [
        {
          name: 'Документы',
          quantity: 1,
          unit: 'шт',
          weight: 0.5,
          value: 1000,
          description: 'Важные документы'
        }
      ],
      totalWeight: 0.5,
      totalValue: 1000,
      barcode: '2001234567890',
      status: 'issued'
    }
  ]
};