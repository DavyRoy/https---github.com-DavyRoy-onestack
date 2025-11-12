export type Channel = {
  id: string;
  name: string;
  type: "email" | "sms" | "messenger";
  provider: string;
  status: "ok" | "degraded" | "down";
  lastCheckAt: string; // ISO
  sent24h: number;
  errors24h: number;
  features?: string[];
  settings?: Record<string, any>;
};

export const CHANNELS: Channel[] = [
  {
    id: "ch_sendgrid",
    name: "Transactional Email",
    type: "email",
    provider: "SendGrid",
    status: "ok",
    lastCheckAt: "2025-10-01T10:00:00Z",
    sent24h: 1240,
    errors24h: 3,
    features: ["templates", "variables", "tracking"],
    settings: { mode: "api", baseURL: "https://api.sendgrid.com", maskedKey: "SG.****...****" },
  },
  {
    id: "ch_smtp",
    name: "SMTP Fallback",
    type: "email",
    provider: "SMTP",
    status: "degraded",
    lastCheckAt: "2025-10-01T09:40:00Z",
    sent24h: 230,
    errors24h: 12,
    features: ["smtp", "tls"],
    settings: { mode: "smtp", host: "smtp.example.com", port: 587, tls: true, user: "noreply@…" },
  },
  {
    id: "ch_twilio",
    name: "SMS Notifications",
    type: "sms",
    provider: "Twilio",
    status: "ok",
    lastCheckAt: "2025-10-01T10:05:00Z",
    sent24h: 560,
    errors24h: 2,
    features: ["senderID", "rate-limit"],
    settings: { baseURL: "https://api.twilio.com", maskedKey: "TW.****...****" },
  },
  {
    id: "ch_telegram",
    name: "Telegram Bot",
    type: "messenger",
    provider: "Telegram",
    status: "ok",
    lastCheckAt: "2025-10-01T10:06:30Z",
    sent24h: 120,
    errors24h: 0,
    features: ["bot", "inline", "attachments"],
    settings: { bot: "@demo_support_bot" },
  },
];

export const CHANNEL_STATS = {
  connected: CHANNELS.length,
  activeWebhooks: 3,
  deliveries24h: { delivered: 2410, failed: 18, retry: 7 },
  lastHourErrors: 4,
};