export type CalendarSettings = {
  days: string[]; // mon..sun
  hours: { from: string; to: string };
  bufferMin: number;
  maxPerDay: number;
  autoConfirmOnline: boolean;
  minAheadHours: number;
  maxForwardDays: number;
  requirePrepayForNoShow: boolean;
};

export const defaultCalendarSettings: CalendarSettings = {
  days: ["mon", "tue", "wed", "thu", "fri"],
  hours: { from: "10:00", to: "20:00" },
  bufferMin: 10,
  maxPerDay: 24,
  autoConfirmOnline: false,
  minAheadHours: 2,
  maxForwardDays: 30,
  requirePrepayForNoShow: false,
};

export const LS_KEY_CAL = "demo_manager_settings_calendar_v1";