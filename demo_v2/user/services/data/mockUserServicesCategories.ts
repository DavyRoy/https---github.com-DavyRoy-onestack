export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  children?: ServiceCategory[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "beauty",
    name: "Красота",
    slug: "beauty",
    description: "Уходовые процедуры и эстетика",
    children: [
      { id: "beauty-manicure", name: "Маникюр", slug: "manicure" },
      { id: "beauty-facial", name: "Уход за лицом", slug: "facial" },
      { id: "beauty-brows", name: "Брови и ресницы", slug: "brows" },
    ],
  },
  {
    id: "spa",
    name: "SPA",
    slug: "spa",
    description: "Релакс-терапии и wellness",
    children: [
      { id: "spa-massage", name: "Массаж", slug: "massage" },
      { id: "spa-hammam", name: "Хаммам", slug: "hammam" },
      { id: "spa-bath", name: "Банные комплексы", slug: "bath" },
    ],
  },
  {
    id: "fitness",
    name: "Фитнес и йога",
    slug: "fitness",
    description: "Индивидуальные тренировки и группы",
    children: [
      { id: "fitness-yoga", name: "Йога", slug: "yoga" },
      { id: "fitness-pilates", name: "Пилатес", slug: "pilates" },
      { id: "fitness-pt", name: "Персональный тренинг", slug: "personal-training" },
    ],
  },
  {
    id: "business",
    name: "B2B / Мероприятия",
    slug: "business",
    children: [
      { id: "business-corporate", name: "Корпоративные программы", slug: "corporate" },
      { id: "business-rent", name: "Аренда пространства", slug: "rent" },
    ],
  },
];
