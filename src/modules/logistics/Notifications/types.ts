export interface Notification {
  id: string;
  type: 'order' | 'delivery' | 'system' | 'alert' | 'warning';
  title: string;
  message: string;
  channel: 'push' | 'email' | 'sms' | 'all';
  status: 'sent' | 'pending' | 'failed';
  read: boolean;
  createdAt: string;
  recipient?: string;
  actionUrl?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: Notification['type'];
  title: string;
  message: string;
  channels: Notification['channel'][];
  enabled: boolean;
  triggers: string[];
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    order: boolean;
    delivery: boolean;
    system: boolean;
    alert: boolean;
  };
}