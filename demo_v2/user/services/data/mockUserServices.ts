export type ServiceTag = "new" | "popular" | "discount";

export type ServiceStaff = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  experience: string;
};

export type ServiceSlot = {
  id: string;
  start: string; // ISO
  duration: number; // minutes
  staffId: string;
  locationId: string;
};

export type ServiceLocation = {
  id: string;
  label: string;
  address: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  summary: string;
  description: string;
  duration: number;
  price: number;
  oldPrice?: number;
  deposit?: number;
  tags: ServiceTag[];
  image: string;
  rating: number;
  reviewsCount: number;
  staff: ServiceStaff[];
  locations: ServiceLocation[];
  highlights: string[];
  contraindications: string[];
  slots: ServiceSlot[];
  quickSlots: ServiceSlot[];
};

const staffPool: ServiceStaff[] = [
  {
    id: "staff-olga",
    name: "Ольга Иванова",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80",
    role: "Спа-терапевт",
    rating: 4.9,
    experience: "5 лет",
  },
  {
    id: "staff-dmitry",
    name: "Дмитрий Смирнов",
    avatar: "https://images.unsplash.com/photo-1544723795-432537dc4505?auto=format&fit=crop&w=160&q=80",
    role: "Массажист",
    rating: 4.8,
    experience: "7 лет",
  },
  {
    id: "staff-anna",
    name: "Анна Петрова",
    avatar: "https://images.unsplash.com/photo-1544723795-3fbefd9b4954?auto=format&fit=crop&w=160&q=80",
    role: "Косметолог",
    rating: 4.7,
    experience: "4 года",
  },
  {
    id: "staff-maria",
    name: "Мария Соколова",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80",
    role: "Мастер маникюра",
    rating: 4.9,
    experience: "6 лет",
  },
];

const locations: ServiceLocation[] = [
  { id: "loc-main", label: "Основной салон", address: "Москва, Пресненская наб., 12" },
  { id: "loc-spa", label: "SPA OneStack", address: "Москва, Красная пресня, 14" },
  { id: "loc-yoga", label: "Студия йоги", address: "Москва, Сити, башня Б" },
];

const generateSlots = (serviceId: string, staffId: string, locationId: string, baseDate: string) => {
  const slots: ServiceSlot[] = [];
  const base = new Date(baseDate);
  for (let day = 0; day < 5; day += 1) {
    for (const hour of [10, 12, 15, 18]) {
      const slotDate = new Date(base);
      slotDate.setDate(base.getDate() + day);
      slotDate.setHours(hour, 0, 0, 0);
      slots.push({
        id: `${serviceId}-${staffId}-${day}-${hour}`,
        start: slotDate.toISOString(),
        duration: 60,
        staffId,
        locationId,
      });
    }
  }
  return slots;
};

const today = new Date();
const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0).toISOString();

export const services: Service[] = [
  {
    id: "svc-spa-balance",
    slug: "spa-balance-ritual",
    title: "SPA-ритуал Balance",
    categoryId: "spa-massage",
    summary: "Глубокое расслабление с эфирными маслами и массажем",
    description:
      "Ритуал Balance включает расслабляющий массаж, масляное укутывание и ароматерапию. Помогает восстановить силы и снять накопленный стресс.",
    duration: 90,
    price: 6900,
    oldPrice: 7900,
    deposit: 2000,
    tags: ["popular", "discount"],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=960&q=80",
    rating: 4.9,
    reviewsCount: 128,
    staff: [staffPool[0], staffPool[1]],
    locations: [locations[0], locations[1]],
    highlights: ["Ароматерапия и массаж", "Персональный SPA-мастер", "Напитки и релакс-зона"],
    contraindications: ["Беременность до 12 недель", "Гипертония"],
    slots: generateSlots("svc-spa-balance", staffPool[0].id, locations[0].id, baseDate),
    quickSlots: generateSlots("svc-spa-balance", staffPool[0].id, locations[0].id, baseDate).slice(0, 4),
  },
  {
    id: "svc-facial-glow",
    slug: "facial-glow",
    title: "Glow уход для лица",
    categoryId: "beauty-facial",
    summary: "Комплекс очищения, кислотный пилинг и LED-маска",
    description:
      "Процедура включает индивидуальный анализ кожи, двойное очищение, мягкий кислотный пилинг и LED-терапию для выравнивания тона.",
    duration: 75,
    price: 5200,
    tags: ["new"],
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=960&q=80",
    rating: 4.8,
    reviewsCount: 64,
    staff: [staffPool[2]],
    locations: [locations[0]],
    highlights: ["Анализ кожи", "Массаж лица", "LED-терапия"],
    contraindications: ["Активные воспаления", "Беременность после 20 недель требует консультации"],
    slots: generateSlots("svc-facial-glow", staffPool[2].id, locations[0].id, baseDate),
    quickSlots: generateSlots("svc-facial-glow", staffPool[2].id, locations[0].id, baseDate).slice(0, 4),
  },
  {
    id: "svc-manicure-smart",
    slug: "manicure-smart",
    title: "Умный маникюр",
    categoryId: "beauty-manicure",
    summary: "Аппаратный маникюр + укрепление гелем",
    description:
      "Быстрый маникюр с минимальным травмированием кожи. Включает покрытие биогелем и дизайн по желанию.",
    duration: 60,
    price: 2900,
    tags: ["popular"],
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=960&q=80",
    rating: 4.7,
    reviewsCount: 92,
    staff: [staffPool[3]],
    locations: [locations[0]],
    highlights: ["Аппаратный маникюр", "Укрепление биогелем", "Мини-дизайн"],
    contraindications: ["Кожные заболевания рук"],
    slots: generateSlots("svc-manicure-smart", staffPool[3].id, locations[0].id, baseDate),
    quickSlots: generateSlots("svc-manicure-smart", staffPool[3].id, locations[0].id, baseDate).slice(0, 4),
  },
  {
    id: "svc-yoga-balance",
    slug: "yoga-balance-class",
    title: "Йога Balance",
    categoryId: "fitness-yoga",
    summary: "Индивидуальная практика на 60 минут",
    description:
      "Сессия йоги с персональным тренером. Настрой на дыхание, мягкое вытяжение, работа с осанкой и стрессом.",
    duration: 60,
    price: 3200,
    tags: ["popular"],
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=960&q=80",
    rating: 4.95,
    reviewsCount: 52,
    staff: [staffPool[1]],
    locations: [locations[2]],
    highlights: ["Индивидуальная программа", "Ароматерапия", "Постсессия с рекомендациями"],
    contraindications: ["Тяжёлые травмы суставов"],
    slots: generateSlots("svc-yoga-balance", staffPool[1].id, locations[2].id, baseDate),
    quickSlots: generateSlots("svc-yoga-balance", staffPool[1].id, locations[2].id, baseDate).slice(0, 4),
  },
  {
    id: "svc-hammam-ritual",
    slug: "hammam-ritual",
    title: "Хаммам Ritual",
    categoryId: "spa-hammam",
    summary: "Пилинг, пенное обёртывание и массаж",
    description:
      "Традиционный хаммам с горячим паром, кесе-пилингом и пенным массажем. Завершается чаем и расслаблением.",
    duration: 105,
    price: 8400,
    tags: ["popular", "discount"],
    image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=960&q=80",
    rating: 4.92,
    reviewsCount: 38,
    staff: [staffPool[0], staffPool[1]],
    locations: [locations[1]],
    highlights: ["Пилинг кесе", "Массаж", "Традиционный чай"],
    contraindications: ["Кожные заболевания", "Высокое давление"],
    slots: generateSlots("svc-hammam-ritual", staffPool[0].id, locations[1].id, baseDate),
    quickSlots: generateSlots("svc-hammam-ritual", staffPool[0].id, locations[1].id, baseDate).slice(0, 4),
  },
];

export const tags: { id: ServiceTag; label: string }[] = [
  { id: "popular", label: "Популярно" },
  { id: "new", label: "Новинка" },
  { id: "discount", label: "Со скидкой" },
];
