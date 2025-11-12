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
export const ADMIN_CRM_CLIENTS: AdminClient[] = [
  { id: "c1", name: "Анна Петрова", company: "Omega Spa", email: "anna@example.com", phone: "+7 901 111-22-33", tags: ["vip","active"], city:"Москва", country:"RU", lastActivityAt:"2025-09-28T14:00:00Z", orders: 12, ltv: 184000, managerId:"u1" },
  { id: "c2", name: "ИП Селезнёв", company: "ИП Селезнёв", email: "ip@seleznev.ru", tags: ["b2b"], city:"Санкт-Петербург", country:"RU", lastActivityAt:"2025-09-20T10:00:00Z", orders: 5, ltv: 92000, managerId:"u2" },
  { id: "c3", name: "Дарья К.", email:"daria@example.com", phone:"+7 901 222-33-44", tags:["churn_risk"], city:"Казань", country:"RU", lastActivityAt:"2025-06-10T08:00:00Z", orders: 3, ltv: 28000 },
  { id: "c4", name:"ООО «Бьюти»", company:"ООО «Бьюти»", email:"office@beauty.ru", tags:["b2b","active"], city:"Екатеринбург", country:"RU", lastActivityAt:"2025-10-01T09:00:00Z", orders: 21, ltv: 520000, managerId:"u1" },
];

export const ADMIN_CRM_META = {
  total: ADMIN_CRM_CLIENTS.length,
  new30d: 12,
  active30d: 31,
  churn90d: 7,
};

export type AdminUser = { id: string; name: string };
export const ADMIN_USERS: AdminUser[] = [
  { id:"u1", name:"Менеджер Алина" },
  { id:"u2", name:"Менеджер Борис" },
];