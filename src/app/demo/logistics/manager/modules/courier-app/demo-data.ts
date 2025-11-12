export const courierDemoData = {
  couriers: [
    {
      id: '1',
      name: 'Алексей Смирнов',
      phone: '+7 912 345-67-90',
      vehicle: 'Hyundai Solaris (A123BC777)',
      status: 'on_route',
      completedToday: 8,
      rating: 4.8,
      currentRoute: [
        {
          id: '1',
          orderId: 'ORD-001',
          address: 'Москва, ул. Арбат, д. 25, кв. 5',
          customer: 'Иван Петров',
          phone: '+7 912 345-67-89',
          instructions: 'Звонить за 10 минут, домофон 25К',
          status: 'arrived',
          estimatedTime: '14:30',
          sequence: 1,
          coordinates: { lat: 55.7495, lng: 37.5903 }
        }
      ]
    }
  ]
};