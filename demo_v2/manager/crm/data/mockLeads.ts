export type LeadStatus = "new" | "in_progress" | "closed";
export type LeadSource = "site" | "call" | "messenger" | "ref";

export type Lead = {
  id: string;
  name: string;          // имя / компания
  contact: string;       // email или телефон
  source: LeadSource;
  status: LeadStatus;
  budget: number;        // демо
  createdAt: string;     // YYYY-MM-DD
  owner: string;         // ответственный (демо)
};

export const mockLeads: Lead[] = [
  { id: "ld-1001", name: "Салон «Омега»",   contact: "info@omega.salon", source: "site",      status: "new",         budget: 45000, createdAt: "2025-09-26", owner: "Мария" },
  { id: "ld-1002", name: "ИП Селезнёв",     contact: "+7 900 111-22-33",  source: "call",      status: "in_progress", budget: 28000, createdAt: "2025-09-27", owner: "Иван"  },
  { id: "ld-1003", name: "Дарья К.",        contact: "daria@example.com", source: "messenger", status: "in_progress", budget: 12000, createdAt: "2025-09-28", owner: "Ольга" },
  { id: "ld-1004", name: "ООО «Бьюти»",     contact: "office@beauty.ru",  source: "ref",       status: "new",         budget: 95000, createdAt: "2025-09-28", owner: "Мария" },
  { id: "ld-1005", name: "Анна П.",         contact: "+7 900 000-00-03",  source: "site",      status: "closed",      budget: 15000, createdAt: "2025-09-30", owner: "Иван"  },
  { id: "ld-1006", name: "Салон «Мята»",    contact: "hello@myata.salon", source: "site",      status: "new",         budget: 22000, createdAt: "2025-10-01", owner: "Мария" },
  { id: "ld-1007", name: "ООО «Палитра»",   contact: "sales@palitra.ru",  source: "ref",       status: "in_progress", budget: 185000,createdAt: "2025-10-01", owner: "Иван"  },
  { id: "ld-1008", name: "Екатерина Орлова",contact: "kate.o@example.com",source: "messenger", status: "new",         budget: 32000, createdAt: "2025-10-02", owner: "Ольга" },
  { id: "ld-1009", name: "Салон «Сфера»",   contact: "hello@sfera.salon", source: "site",      status: "in_progress", budget: 41000, createdAt: "2025-10-03", owner: "Мария" },
  { id: "ld-1010", name: "ИП «Глянец»",     contact: "gloss@ip.ru",       source: "call",      status: "new",         budget: 27000, createdAt: "2025-10-03", owner: "Иван"  },
  { id: "ld-1011", name: "Студия «Лайм»",   contact: "hi@lime.studio",    source: "messenger", status: "in_progress", budget: 53000, createdAt: "2025-10-04", owner: "Мария" },
  { id: "ld-1012", name: "Мария С.",        contact: "m.smirnova@example.com", source: "ref",  status: "closed",      budget: 25000, createdAt: "2025-10-04", owner: "Ольга" },
  { id: "ld-1013", name: "Студия «Нова»",   contact: "team@nova.studio",  source: "site",      status: "new",         budget: 38000, createdAt: "2025-10-05", owner: "Мария" },
  { id: "ld-1014", name: "Оксана Р.",       contact: "oxana.r@example.com",source: "messenger",status: "in_progress", budget: 19500, createdAt: "2025-10-05", owner: "Ольга" },
  { id: "ld-1015", name: "Мастерская «Арт»",contact: "art@workshop.ru",   source: "call",      status: "closed",      budget: 58000, createdAt: "2025-10-06", owner: "Иван"  },
];