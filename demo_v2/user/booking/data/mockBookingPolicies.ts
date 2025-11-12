export type BookingPolicy = {
  serviceId: string;
  cancellation: string;
  depositPolicy?: string;
  reminders: string;
};

export const bookingPolicies: BookingPolicy[] = [
  {
    serviceId: "svc-spa-balance",
    cancellation:
      "Бесплатная отмена за 24 часа. При отмене или переносе позднее удерживается депозит 30%.",
    depositPolicy: "Депозит списывается автоматически и будет вычтен из финального платежа.",
    reminders: "Мы отправим напоминание за 24 часа по email и SMS.",
  },
  {
    serviceId: "svc-facial-glow",
    cancellation: "Отмена за 12 часов без штрафа. Позднее удерживается 20%.",
    reminders: "Напоминания приходят за 12 часов и за 2 часа до начала.",
  },
];
