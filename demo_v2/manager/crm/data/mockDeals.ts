export type DealStage = "new" | "in_progress" | "proposal" | "won" | "lost";

export type Deal = {
  id: string;
  title: string;
  client: string;
  amount: number;
  stage: DealStage;
  due: string;      // YYYY-MM-DD (след. шаг)
  hot?: boolean;    // «горящая»
  createdAt: string;
};

export const mockDeals: Deal[] = [
  // NEW
  { id: "dl-2001", title: "Оснащение салона «Омега»", client: "Салон «Омега»", amount: 150_000, stage: "new",         due: "2025-10-03", hot: true,  createdAt: "2025-09-26" },
  { id: "dl-2004", title: "Комплект для мастеров",     client: "Дарья К.",      amount: 18_000,  stage: "new",         due: "2025-10-02",           createdAt: "2025-09-29" },
  { id: "dl-2011", title: "Стартовый набор для салона",client: "Студия «Лайм»", amount: 42_000,  stage: "new",         due: "2025-10-05",           createdAt: "2025-10-02" },
  { id: "dl-2012", title: "Первые поставки",           client: "Салон «Сфера»", amount: 35_000,  stage: "new",         due: "2025-10-06",           createdAt: "2025-10-03" },

  // IN PROGRESS
  { id: "dl-2002", title: "Поставка расходников",      client: "ИП Селезнёв",   amount: 38_000,  stage: "in_progress", due: "2025-10-04",           createdAt: "2025-09-27" },
  { id: "dl-2005", title: "Станки и кресла",           client: "Салон «Мята»",  amount: 125_000, stage: "in_progress", due: "2025-10-03", hot: true, createdAt: "2025-09-30" },
  { id: "dl-2013", title: "Ресток витрины",            client: "ИП «Глянец»",   amount: 27_500,  stage: "in_progress", due: "2025-10-07",           createdAt: "2025-10-02" },
  { id: "dl-2014", title: "Поставка оборудования",     client: "ООО «Палитра»", amount: 198_000, stage: "in_progress", due: "2025-10-08",           createdAt: "2025-10-03" },

  // PROPOSAL
  { id: "dl-2003", title: "Оборудование зала",         client: "ООО «Бьюти»",   amount: 220_000, stage: "proposal",    due: "2025-10-06",           createdAt: "2025-09-28" },
  { id: "dl-2006", title: "Годовой контракт",          client: "ООО «Бьюти»",   amount: 520_000, stage: "proposal",    due: "2025-10-08",           createdAt: "2025-10-01" },
  { id: "dl-2015", title: "Расширение ассортимента",    client: "Сеть «БьютиМаркет»", amount: 305_000, stage: "proposal", due: "2025-10-09", createdAt: "2025-10-03" },
  { id: "dl-2016", title: "КП на комплекс",            client: "Академия Стиля",amount: 145_000, stage: "proposal",    due: "2025-10-10",           createdAt: "2025-10-04" },

  // WON
  { id: "dl-2007", title: "Демо-набор",                 client: "Анна П.",       amount: 12_000,  stage: "won",         due: "2025-10-01",           createdAt: "2025-10-01" },
  { id: "dl-2017", title: "Пакет для VIP",              client: "Екатерина Орлова", amount: 89_000, stage: "won",      due: "2025-10-02",           createdAt: "2025-10-02" },
  { id: "dl-2018", title: "Комплект инструмента",       client: "Мария С.",      amount: 24_500,  stage: "won",         due: "2025-10-03",           createdAt: "2025-10-02" },

  // LOST
  { id: "dl-2008", title: "Ретурация партии",          client: "ИП Селезнёв",   amount: 0,       stage: "lost",        due: "2025-09-30",           createdAt: "2025-09-30" },
  { id: "dl-2019", title: "Снято с приоритета",        client: "Студия «Нова»", amount: 0,       stage: "lost",        due: "2025-10-02",           createdAt: "2025-10-02" },
  { id: "dl-2020", title: "Аннулирование КП",          client: "Мастерская «Арт»", amount: 0,    stage: "lost",        due: "2025-10-03",           createdAt: "2025-10-03" },
];

export const STAGES: { id: DealStage; title: string }[] = [
  { id: "new",         title: "Новый" },
  { id: "in_progress", title: "В работе" },
  { id: "proposal",    title: "Коммерческое" },
  { id: "won",         title: "Успех" },
  { id: "lost",        title: "Потеряно" },
];