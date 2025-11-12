export type CurrencyConfig = {
  base: string; // базовая валюта расчётов
  display: string; // валюта отображения в UI
  allowed: string[]; // список доступных валют
};

export type ExchangeRate = {
  id: string;
  from: string;
  to: string;
  rate: number;
  source: "manual" | "api";
  updated: string; // ISO дата
};

export type FormatConfig = {
  locale: string;
  date: string; // формат даты
  time24: boolean; // использовать 24-часовой формат
  number?: {
    grouping?: boolean;
    decimals?: number;
  };
};

export const defaultCurrency: CurrencyConfig = {
  base: "RUB",
  display: "RUB",
  allowed: ["RUB", "KRW", "USD"],
};

export const defaultRates: ExchangeRate[] = [
  {
    id: "r1",
    from: "USD",
    to: "RUB",
    rate: 90.0,
    source: "manual",
    updated: "2025-10-06",
  },
  {
    id: "r2",
    from: "KRW",
    to: "RUB",
    rate: 0.07,
    source: "manual",
    updated: "2025-10-06",
  },
];

export const defaultFormat: FormatConfig = {
  locale: "ru-RU",
  date: "dd.MM.yyyy",
  time24: true,
  number: { grouping: true, decimals: 2 },
};