export const mockCheckout = {
  prefillName: 'Иван Петров',
  prefillEmail: 'ivan@example.com',
  prefillPhone: '+7 900 000 00 00',
  fromCart: true,
  hasDelivery: true,
  pointsBalance: 500,
  currency: '₽',
  items: [
    { id: 'p1', name: 'Товар A', price: 1200, qty: 1 },
    { id: 'p2', name: 'Депозит брони', price: 500, qty: 1, isDeposit: true },
  ],
}
