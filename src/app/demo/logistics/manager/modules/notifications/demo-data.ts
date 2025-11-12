export const notificationsDemoData = {
  notifications: [
    {
      id: '1',
      type: 'delivery',
      title: 'Доставка завершена',
      message: 'Заказ ORD-001 успешно доставлен получателю',
      channel: 'push',
      status: 'sent',
      read: false,
      createdAt: '2024-01-15T15:30:00Z',
      actionUrl: '/demo/logistics/user/modules/delivery-tracking'
    },
    {
      id: '2',
      type: 'order',
      title: 'Новый заказ',
      message: 'Получен новый заказ ORD-002 от Ивана Петрова',
      channel: 'email',
      status: 'sent',
      read: true,
      createdAt: '2024-01-15T14:20:00Z'
    }
  ],
  templates: [
    {
      id: '1',
      name: 'Заказ создан',
      type: 'order',
      title: 'Новый заказ #{orderId}',
      message: 'Заказ #{orderId} создан и ожидает обработки. Клиент: #{customerName}',
      channels: ['email', 'push'],
      enabled: true,
      triggers: ['order_created']
    }
  ]
};