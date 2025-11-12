export type Notifications = {
  channels: { email: boolean; messenger: boolean; toast: boolean };
  events: string[]; // ids
  quietHours: { from: string; to: string } | null;
  dailyDigest: boolean;
};

export const EVENT_OPTIONS = [
  { id: "order_new", label: "Заказ — новый" },
  { id: "order_paid", label: "Заказ — оплачен" },
  { id: "order_cancel", label: "Заказ — отменён" },
  { id: "book_new", label: "Бронь — новая" },
  { id: "book_pending", label: "Бронь — без подтверждения 24ч" },
  { id: "book_move", label: "Бронь — перенесена" },
  { id: "book_cancel", label: "Бронь — отменена" },
  { id: "book_noshow", label: "Бронь — no-show" },
  { id: "crm_new", label: "CRM — новый лид" },
  { id: "crm_overdue", label: "CRM — лид без ответа 24ч" },
  { id: "deal_won", label: "CRM — сделка выиграна" },
  { id: "deal_lost", label: "CRM — сделка проиграна" },
];

export const defaultNotifications: Notifications = {
  channels: { email: true, messenger: false, toast: true },
  events: ["order_new", "book_pending", "crm_new"],
  quietHours: { from: "22:00", to: "08:00" },
  dailyDigest: true,
};

export const LS_KEY_NOTIF = "demo_manager_settings_notifications_v1";