export type Integrations = {
  email: boolean;
  messenger: boolean;
  webhooks: string[]; // urls (демо)
  calendarSync: boolean;
};

export const defaultIntegrations: Integrations = {
  email: true,
  messenger: false,
  webhooks: ["https://example.com/webhook-demo"],
  calendarSync: false,
};

export const LS_KEY_INT = "demo_manager_settings_integrations_v1";