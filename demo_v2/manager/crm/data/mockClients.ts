export type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string; // YYYY-MM-DD
  tags?: string[];   // ожидаются значения: "VIP" | "retail" | "b2b" | "salon"
};

export const mockClients: Client[] = [
  { id: "cl-7001", name: "Иван Петров",    email: "ivan@example.com",     phone: "+7 900 000-01-01", createdAt: "2025-09-26", tags:["VIP"] },
  { id: "cl-7002", name: "Салон «Омега»",  email: "info@omega.salon",     phone: "+7 900 000-01-02", createdAt: "2025-09-28", tags:["salon","retail"] },
  { id: "cl-7003", name: "Дарья К.",       email: "daria@example.com",    phone: "+7 900 000-01-03", createdAt: "2025-09-30", tags:["retail"] },
  { id: "cl-7004", name: "ООО «Бьюти»",    email: "office@beauty.ru",     phone: "+7 900 000-01-04", createdAt: "2025-10-01", tags:["b2b"] },
  { id: "cl-7005", name: "Салон «Мята»",   email: "hello@myata.salon",    phone: "+7 900 000-01-05", createdAt: "2025-10-02", tags:["salon"] },

  { id: "cl-7006", name: "Екатерина Орлова", email: "kate.o@example.com",   phone: "+7 900 000-01-06", createdAt: "2025-10-03", tags:["VIP","retail"] },
  { id: "cl-7007", name: "ИП «Глянец»",      email: "gloss@ip.ru",          phone: "+7 900 000-01-07", createdAt: "2025-10-04", tags:["b2b","retail"] },
  { id: "cl-7008", name: "Студия «Лайм»",    email: "hi@lime.studio",       phone: "+7 900 000-01-08", createdAt: "2025-10-04", tags:["salon"] },
  { id: "cl-7009", name: "Мария С.",         email: "m.smirnova@example.com", phone: "+7 900 000-01-09", createdAt: "2025-10-05", tags:["retail"] },
  { id: "cl-7010", name: "ООО «Палитра»",    email: "sales@palitra.ru",     phone: "+7 900 000-01-10", createdAt: "2025-10-05", tags:["b2b"] },

  // разные комбинации контактов (для проверки плейсхолдеров)
  { id: "cl-7011", name: "Салон «Сфера»",    email: "hello@sfera.salon",    createdAt: "2025-10-06", tags:["salon","retail"] },
  { id: "cl-7012", name: "Роман Белов",      phone: "+7 900 000-01-12",     createdAt: "2025-10-06", tags:["retail"] },
  { id: "cl-7013", name: "Академия Стиля",   email: "contact@style.ac",     phone: "+7 900 000-01-13", createdAt: "2025-10-07", tags:["b2b"] },
  { id: "cl-7014", name: "Сеть «БьютиМаркет»", email: "hq@beautymarket.ru", phone: "+7 900 000-01-14", createdAt: "2025-10-07", tags:["b2b","retail"] },
  { id: "cl-7015", name: "Оксана Р.",        email: "oxana.r@example.com",  phone: "+7 900 000-01-15", createdAt: "2025-10-08", tags:["VIP"] },

  // без тегов — должно отображаться «—»
  { id: "cl-7016", name: "Студия «Нова»",    email: "team@nova.studio",     phone: "+7 900 000-01-16", createdAt: "2025-10-08" },
  { id: "cl-7017", name: "Павел К.",         phone: "+7 900 000-01-17",     createdAt: "2025-10-09" },
  { id: "cl-7018", name: "Мастерская «Арт»", email: "art@workshop.ru",      createdAt: "2025-10-09", tags:["b2b"] },
];