// стабильно, без рандома
export type AdminClient = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  tags: string[];
  city?: string;
  country?: string;
  lastActivityAt?: string; // ISO
  orders: number;
  ltv: number; // ₽ демо
  managerId?: string;
};

export type AdminUser = { id: string; name: string };

/** Менеджеры: 10 шт. (часть без клиентов) */
export const ADMIN_USERS: AdminUser[] = [
  { id: "u1",  name: "Менеджер Алина" },
  { id: "u2",  name: "Менеджер Борис" },
  { id: "u3",  name: "Менеджер Виктория" },
  { id: "u4",  name: "Менеджер Глеб" },
  { id: "u5",  name: "Менеджер Диана" },
  { id: "u6",  name: "Менеджер Егор" },
  { id: "u7",  name: "Менеджер Жанна" },
  { id: "u8",  name: "Менеджер Зоя" },     // без клиентов
  { id: "u9",  name: "Менеджер Иван" },    // без клиентов
  { id: "u10", name: "Менеджер Карина" },  // без клиентов
];

/**
 * Распределение клиентов по менеджерам:
 * u1: 3, u2: 3, u3: 2, u4: 2, u5: 2, u6: 1, u7: 1, u8: 0, u9: 0, u10: 0
 * Остальные клиенты — без менеджера.
 */
export const ADMIN_CRM_CLIENTS: AdminClient[] = [
  // --- u1 (3 клиента)
  { id: "c1",  name: "Анна Петрова", company: "Omega Spa", email: "anna@example.com", phone: "+7 901 111-22-33", tags: ["vip","active"], city:"Москва", country:"RU", lastActivityAt:"2025-09-28T14:00:00Z", orders: 12, ltv: 184000, managerId:"u1" },
  { id: "c4",  name: "ООО «Бьюти»", company:"ООО «Бьюти»", email:"office@beauty.ru", tags:["b2b","active"], city:"Екатеринбург", country:"RU", lastActivityAt:"2025-10-01T09:00:00Z", orders: 21, ltv: 520000, managerId:"u1" },
  { id: "c5",  name: "Роман Соколов", email:"roman.sok@example.com", phone:"+7 981 123-45-67", tags:["returning"], city:"Санкт-Петербург", country:"RU", lastActivityAt:"2025-09-15T11:30:00Z", orders: 6, ltv: 76000, managerId:"u1" },

  // --- u2 (3 клиента)
  { id: "c2",  name: "ИП Селезнёв", company:"ИП Селезнёв", email:"ip@seleznev.ru", tags:["b2b"], city:"Санкт-Петербург", country:"RU", lastActivityAt:"2025-09-20T10:00:00Z", orders: 5, ltv: 92000, managerId:"u2" },
  { id: "c6",  name: "Мария Орлова", email:"maria.orlova@example.com", phone:"+7 901 555-66-77", tags:["active","newsletter"], city:"Ростов-на-Дону", country:"RU", lastActivityAt:"2025-10-05T16:45:00Z", orders: 9, ltv: 112000, managerId:"u2" },
  { id: "c7",  name: "ООО «ФрешМаркет»", company:"ООО «ФрешМаркет»", email:"proc@freshm.ru", tags:["b2b","prospect"], city:"Новосибирск", country:"RU", lastActivityAt:"2025-08-22T12:00:00Z", orders: 2, ltv: 48000, managerId:"u2" },

  // --- u3 (2 клиента)
  { id: "c8",  name: "Даниил Ким", email:"dan.kim@example.com", tags:["inactive"], city:"Казань", country:"RU", lastActivityAt:"2025-05-02T09:00:00Z", orders: 1, ltv: 8000, managerId:"u3" },
  { id: "c9",  name: "Анастасия Р.", email:"anastasia.r@example.com", phone:"+7 903 000-11-22", tags:["active","vip"], city:"Москва", country:"RU", lastActivityAt:"2025-10-04T18:10:00Z", orders: 18, ltv: 240000, managerId:"u3" },

  // --- u4 (2 клиента)
  { id: "c10", name: "ООО «АльфаМед»", company:"ООО «АльфаМед»", email:"info@alfamed.ru", tags:["b2b","active"], city:"Самара", country:"RU", lastActivityAt:"2025-09-12T13:20:00Z", orders: 7, ltv: 196000, managerId:"u4" },
  { id: "c11", name: "Светлана К.", email:"svetl.k@example.com", tags:["churn_risk"], city:"Тюмень", country:"RU", lastActivityAt:"2025-06-18T08:40:00Z", orders: 3, ltv: 32000, managerId:"u4" },

  // --- u5 (2 клиента)
  { id: "c12", name: "ЧТУП «БелКосметика»", company:"ЧТУП «БелКосметика»", email:"sales@belcos.by", tags:["b2b","active"], city:"Минск", country:"BY", lastActivityAt:"2025-09-30T10:00:00Z", orders: 11, ltv: 310000, managerId:"u5" },
  { id: "c13", name: "ТОО «Крафт Сервис»", company:"ТОО «Крафт Сервис»", email:"hello@kraft.kz", tags:["b2b","prospect"], city:"Алматы", country:"KZ", lastActivityAt:"2025-07-07T07:15:00Z", orders: 2, ltv: 54000, managerId:"u5" },

  // --- u6 (1 клиент)
  { id: "c14", name: "Елена Морозова", email:"elena.m@example.com", phone:"+7 905 333-22-11", tags:["active"], city:"Пермь", country:"RU", lastActivityAt:"2025-10-03T17:05:00Z", orders: 4, ltv: 42000, managerId:"u6" },

  // --- u7 (1 клиент)
  { id: "c15", name: "ООО «ГринЛайн»", company:"ООО «ГринЛайн»", email:"office@greenline.ru", tags:["b2b","inactive"], city:"Краснодар", country:"RU", lastActivityAt:"2025-04-11T12:00:00Z", orders: 1, ltv: 15000, managerId:"u7" },

  // --- без менеджера (6 клиентов)
  { id: "c3",  name: "Дарья К.", email:"daria@example.com", phone:"+7 901 222-33-44", tags:["churn_risk"], city:"Казань", country:"RU", lastActivityAt:"2025-06-10T08:00:00Z", orders: 3, ltv: 28000 },
  { id: "c16", name: "ИП Королёв", company:"ИП Королёв", email:"ip.korolev@example.com", tags:["b2b","new"], city:"Воронеж", country:"RU", lastActivityAt:"2025-10-06T09:00:00Z", orders: 1, ltv: 21000 },
  { id: "c17", name: "Наталья П.", email:"nat.p@example.com", tags:["newsletter","returning"], city:"Уфа", country:"RU", lastActivityAt:"2025-09-25T15:30:00Z", orders: 5, ltv: 57000 },
  { id: "c18", name: "СП «Розмарин»", company:"СП «Розмарин»", email:"contact@rozmarin.pl", tags:["b2b","prospect"], city:"Гданьск", country:"PL", lastActivityAt:"2025-08-18T10:20:00Z", orders: 0, ltv: 0 },
  { id: "c19", name: "Игорь Васильев", email:"igor.v@example.com", tags:["inactive"], city:"Нижний Новгород", country:"RU", lastActivityAt:"2025-02-03T11:00:00Z", orders: 1, ltv: 6000 },
  { id: "c20", name: "ООО «Сила Цвета»", company:"ООО «Сила Цвета»", email:"hr@silacveta.ru", tags:["b2b","active"], city:"Челябинск", country:"RU", lastActivityAt:"2025-09-29T14:45:00Z", orders: 8, ltv: 134000 },
];

export const ADMIN_CRM_META = {
  total: ADMIN_CRM_CLIENTS.length,
  new30d: 8,
  active30d: 14,
  churn90d: 5,
};