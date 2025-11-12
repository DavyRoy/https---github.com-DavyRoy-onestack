export const trackingDemoData = {
  couriers: [
    {
      id: '1',
      name: 'Алексей Смирнов',
      phone: '+7 912 345-67-90',
      vehicle: 'Hyundai Solaris',
      status: 'on_route',
      currentLocation: { lat: 55.7558, lng: 37.6173 },
      route: [
        {
          id: '1',
          orderId: 'ORD-001',
          address: 'Москва, ул. Арбат, д. 25, кв. 5',
          customer: 'Иван Петров',
          phone: '+7 912 345-67-89',
          status: 'arrived',
          estimatedTime: '14:30',
          sequence: 1,
          coordinates: { lat: 55.7495, lng: 37.5903 }
        },
        {
          id: '2',
          orderId: 'ORD-002',
          address: 'Москва, ул. Тверская, д. 10, офис 45',
          customer: 'Мария Иванова',
          phone: '+7 912 345-67-91',
          status: 'pending',
          estimatedTime: '15:15',
          sequence: 2,
          coordinates: { lat: 55.7576, lng: 37.6050 }
        }
      ]
    },
    {
      id: '2',
      name: 'Дмитрий Козлов',
      phone: '+7 912 345-67-92',
      vehicle: 'Kia Rio',
      status: 'on_route',
      currentLocation: { lat: 55.7512, lng: 37.6185 },
      route: [
        {
          id: '3',
          orderId: 'ORD-003',
          address: 'Москва, ул. Новый Арбат, д. 15',
          customer: 'Сергей Волков',
          phone: '+7 912 345-67-93',
          status: 'pending',
          estimatedTime: '16:00',
          sequence: 1,
          coordinates: { lat: 55.7520, lng: 37.5900 }
        }
      ]
    }
  ]
};