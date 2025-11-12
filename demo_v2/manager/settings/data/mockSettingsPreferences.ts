export type Preferences = {
  currency: "RUB" | "KRW" | "USD";
  dateFmt: "DD.MM.YY" | "YYYY-MM-DD";
  timeFmt: "24h" | "12h";
  thousandSep: "space" | "comma";
  locale: "ru" | "en" | "ko";
  tableDensity: "compact" | "normal" | "comfortable";
  calendarStartView: "day" | "week" | "month";
  defaultHome: "dashboard" | "orders" | "booking" | "calendar";
};

export const defaultPreferences: Preferences = {
  currency: "RUB",
  dateFmt: "DD.MM.YY",
  timeFmt: "24h",
  thousandSep: "space",
  locale: "ru",
  tableDensity: "normal",
  calendarStartView: "week",
  defaultHome: "dashboard",
};

export const LS_KEY_PREF = "demo_manager_settings_preferences_v1";