export type Profile = {
  firstName: string;
  lastName: string;
  title?: string;
  phone?: string;
  email: string;
  tz: string;
  locale: "ru" | "en" | "ko";
  signature?: string;
  avatar?: string; // dataURL (демо)
};

export const defaultProfile: Profile = {
  firstName: "Алексей",
  lastName: "Иванов",
  title: "Менеджер",
  phone: "+7 900 000-00-00",
  email: "alex@example.com",
  tz: "Asia/Seoul",
  locale: "ru",
  signature: "С уважением,\nАлексей Иванов\nКомпания Demo",
  avatar: "",
};

export const LS_KEY_PROFILE = "demo_manager_settings_profile_v1";