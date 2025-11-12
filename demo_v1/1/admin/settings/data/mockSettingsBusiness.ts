export type BusinessInfo = {
  name: string;
  reg: string;
  address: string;
  site: string;
  email: string;
  tz: string;
  phone: string;
};

export type Location = {
  id: string;
  name: string;
  city: string;
  country: string;
  tz: string;
  phone: string;
  active: boolean;
  hours: Record<string, string>; // "mon": "9-18" и т.п.
};

export const defaultBusiness: BusinessInfo = {
  name: "ООО «Демо»",
  reg: "7700000000",
  address: "Москва, ул. Пример, 1",
  site: "https://example.com",
  email: "billing@example.com",
  tz: "Europe/Moscow",
  phone: "+7 (000) 000-00-00",
};

export const defaultLocations: Location[] = [
  {
    id: "loc_main",
    name: "Центральный офис",
    city: "Москва",
    country: "RU",
    tz: "Europe/Moscow",
    phone: "+7 (000) 000-00-01",
    active: true,
    hours: {
      mon: "09:00-18:00",
      tue: "09:00-18:00",
      wed: "09:00-18:00",
      thu: "09:00-18:00",
      fri: "09:00-17:00",
    },
  },
  {
    id: "loc_south",
    name: "Южный филиал",
    city: "Сочи",
    country: "RU",
    tz: "Europe/Moscow",
    phone: "+7 (000) 000-00-02",
    active: true,
    hours: {
      mon: "10:00-19:00",
      tue: "10:00-19:00",
      wed: "10:00-19:00",
      thu: "10:00-19:00",
      fri: "10:00-18:00",
    },
  },
];