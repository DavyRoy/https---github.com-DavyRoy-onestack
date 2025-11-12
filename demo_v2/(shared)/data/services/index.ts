// app/demo/(shared)/data/services/index.ts
// Детерминированные моки "как в реальном проекте":
// - 5 категорий услуг
// - в каждой по 5 услуг (итого 25)
// - специалисты, их навыки/цены/длительности
// - недельные графики c рабочими интервалами и перерывами
// - без рандома (безопасно для гидрации)

export type ServiceTag = "hit" | "season" | "vip";
export type Status = "active" | "draft" | "archived";

export type AdminServiceCategory = {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  position?: number;
  isActive?: boolean;
};

export type AdminService = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  status: Status;
  durationMin: number;       // дефолтная длительность
  price: number;             // базовая цена (RUB)
  tags?: ServiceTag[];
  changedAt?: string;        // YYYY-MM-DD
  description?: string;
};

export type AdminBundle = {
  id: string;
  name: string;
  type: "package" | "subscription";
  status: Status;
  price: number;
  periodDays?: number; // для subscription
  items: { serviceId: string; qty?: number }[];
  categoryId?: string;
};

/** Единый слот для календарей */
export const SLOT_SIZE_MIN = 15;

export type DayOfWeek = 0|1|2|3|4|5|6; // 0=вс, 1=пн... 6=сб

/** Временной интервал в формате HH:MM (локальное время) */
export type TimeRange = { start: string; end: string };

export type WeeklySchedule = {
  /** Рабочие часы по дням недели (м.б. несколько интервалов) */
  working: Partial<Record<DayOfWeek, TimeRange[]>>;
  /** Перерывы внутри рабочего дня (например обед) */
  breaks?: Partial<Record<DayOfWeek, TimeRange[]>>;
  /** Дни без записей (жёсткий выходной) — имеет приоритет над working */
  dayOff?: DayOfWeek[];
};

/** Навык = специалист оказывает конкретную услугу с возможными оверрайдами */
export type SpecialistSkill = {
  serviceId: string;
  isActive: boolean;
  /** Персональная длительность (если отличается от дефолтной услуги) */
  durationMinOverride?: number;
  /** Персональная цена (если отличается от базовой) */
  priceOverride?: number;
};

export type AdminSpecialist = {
  id: string;
  name: string;
  role: "master" | "top-master" | "junior";
  status: Status;
  skills: SpecialistSkill[];
  schedule: WeeklySchedule;
  /** По умолчанию размер слота у специалиста — 15 мин, но можно переопределить */
  slotSizeMin?: number;
  /** Видимые теги/ярлыки в записи */
  labels?: string[];
};

/* ===================== КАТЕГОРИИ (5 шт) ===================== */

export const SERVICE_CATEGORIES: AdminServiceCategory[] = [
  { id: "scat-hair",   name: "Волосы",       slug: "hair",   position: 1, isActive: true },
  { id: "scat-nails",  name: "Ногти",        slug: "nails",  position: 2, isActive: true },
  { id: "scat-spa",    name: "SPA",          slug: "spa",    position: 3, isActive: true },
  { id: "scat-brows",  name: "Брови/Ресницы",slug: "brows",  position: 4, isActive: true },
  { id: "scat-makeup", name: "Макияж",       slug: "makeup", position: 5, isActive: true },
];

/* ===================== УСЛУГИ (по 5 в каждой) ===================== */

export const ADMIN_SERVICES: AdminService[] = [
  // Волосы
  { id: "srv-h-001", name: "Стрижка женская", slug: "female-haircut", categoryId: "scat-hair", status: "active", durationMin: 60, price: 1800, tags: ["hit"], changedAt: "2025-09-01", description: "Мытьё + стрижка + укладка" },
  { id: "srv-h-002", name: "Стрижка мужская", slug: "male-haircut",   categoryId: "scat-hair", status: "active", durationMin: 45, price: 1400, changedAt: "2025-09-03" },
  { id: "srv-h-003", name: "Укладка вечерняя", slug: "evening-styling", categoryId: "scat-hair", status: "active", durationMin: 45, price: 1600, tags: ["season"], changedAt: "2025-09-05" },
  { id: "srv-h-004", name: "Окрашивание однотонное", slug: "single-color", categoryId: "scat-hair", status: "active", durationMin: 120, price: 4200 },
  { id: "srv-h-005", name: "Ламинирование волос", slug: "hair-lamination", categoryId: "scat-hair", status: "draft", durationMin: 90, price: 3500 },

  // Ногти
  { id: "srv-n-001", name: "Маникюр классический", slug: "classic-manicure", categoryId: "scat-nails", status: "active", durationMin: 60, price: 1500 },
  { id: "srv-n-002", name: "Маникюр + гель-лак", slug: "manicure-gel", categoryId: "scat-nails", status: "active", durationMin: 90, price: 2200, tags: ["hit"] },
  { id: "srv-n-003", name: "Снятие покрытия", slug: "gel-removal", categoryId: "scat-nails", status: "active", durationMin: 30, price: 600 },
  { id: "srv-n-004", name: "Педикюр базовый", slug: "basic-pedicure", categoryId: "scat-nails", status: "active", durationMin: 60, price: 1700 },
  { id: "srv-n-005", name: "Укрепление ногтей", slug: "nail-reinforcement", categoryId: "scat-nails", status: "draft", durationMin: 45, price: 1200 },

  // SPA
  { id: "srv-s-001", name: "Массаж спины 60 мин", slug: "back-massage-60", categoryId: "scat-spa", status: "active", durationMin: 60, price: 2500 },
  { id: "srv-s-002", name: "Общий массаж 90 мин", slug: "full-body-90", categoryId: "scat-spa", status: "active", durationMin: 90, price: 4200 },
  { id: "srv-s-003", name: "SPA-уход Relax 90 мин", slug: "spa-relax-90", categoryId: "scat-spa", status: "active", durationMin: 90, price: 3900, tags: ["vip"], changedAt: "2025-08-28" },
  { id: "srv-s-004", name: "Стоун-терапия 60 мин", slug: "stone-therapy-60", categoryId: "scat-spa", status: "draft", durationMin: 60, price: 3200 },
  { id: "srv-s-005", name: "Скраб + обёртывание 75 мин", slug: "scrub-wrap-75", categoryId: "scat-spa", status: "active", durationMin: 75, price: 3300 },

  // Брови/Ресницы
  { id: "srv-b-001", name: "Коррекция бровей", slug: "brows-correction", categoryId: "scat-brows", status: "active", durationMin: 30, price: 900 },
  { id: "srv-b-002", name: "Окрашивание бровей", slug: "brows-color", categoryId: "scat-brows", status: "active", durationMin: 30, price: 1000 },
  { id: "srv-b-003", name: "Ламинирование бровей", slug: "brows-lamination", categoryId: "scat-brows", status: "active", durationMin: 60, price: 2500 },
  { id: "srv-b-004", name: "Ламинирование ресниц", slug: "lashes-lamination", categoryId: "scat-brows", status: "active", durationMin: 60, price: 2600 },
  { id: "srv-b-005", name: "Наращивание ресниц классика", slug: "lashes-classic", categoryId: "scat-brows", status: "draft", durationMin: 120, price: 3800 },

  // Макияж
  { id: "srv-m-001", name: "Макияж дневной", slug: "makeup-day", categoryId: "scat-makeup", status: "active", durationMin: 45, price: 2000 },
  { id: "srv-m-002", name: "Макияж вечерний", slug: "makeup-evening", categoryId: "scat-makeup", status: "active", durationMin: 60, price: 2600, tags: ["season"] },
  { id: "srv-m-003", name: "Макияж для фотосессии", slug: "makeup-photo", categoryId: "scat-makeup", status: "active", durationMin: 75, price: 3200 },
  { id: "srv-m-004", name: "Свадебный макияж", slug: "makeup-wedding", categoryId: "scat-makeup", status: "active", durationMin: 90, price: 4800, tags: ["vip"] },
  { id: "srv-m-005", name: "Пробный свадебный", slug: "makeup-wedding-trial", categoryId: "scat-makeup", status: "active", durationMin: 75, price: 3500 },
];

/* ===================== ПАКЕТЫ/АБОНЕМЕНТЫ (10 шт) ===================== */
export const ADMIN_BUNDLES: AdminBundle[] = [
  // SPA
  { id: "bndl-001", name: "5× Массаж 60 мин", type: "package", status: "active", price: 11000, items: [{ serviceId: "srv-s-001", qty: 5 }], categoryId: "scat-spa" },
  { id: "bndl-002", name: "Безлимит SPA 30 дней", type: "subscription", status: "draft", price: 29000, periodDays: 30, items: [{ serviceId: "srv-s-003" }], categoryId: "scat-spa" },

  // Ногти
  { id: "bndl-003", name: "Маникюр + гель-лак ×3", type: "package", status: "active", price: 6000, items: [{ serviceId: "srv-n-002", qty: 3 }], categoryId: "scat-nails" },

  // Макияж
  { id: "bndl-004", name: "Абонемент: макияж 30 дней", type: "subscription", status: "active", price: 15000, periodDays: 30, items: [{ serviceId: "srv-m-002" }], categoryId: "scat-makeup" },

  // Волосы — комбинированный пакет
  { id: "bndl-005", name: "Стрижка + вечерняя укладка", type: "package", status: "active", price: 3200, items: [{ serviceId: "srv-h-001", qty: 1 }, { serviceId: "srv-h-003", qty: 1 }], categoryId: "scat-hair" },

  // SPA — уикенд-набор
  { id: "bndl-006", name: "SPA-Weekend (Relax + спина)", type: "package", status: "active", price: 6500, items: [{ serviceId: "srv-s-003", qty: 1 }, { serviceId: "srv-s-001", qty: 1 }], categoryId: "scat-spa" },

  // Брови/ресницы — комбо
  { id: "bndl-007", name: "Ламинирование бровей + ресниц", type: "package", status: "active", price: 4800, items: [{ serviceId: "srv-b-003", qty: 1 }, { serviceId: "srv-b-004", qty: 1 }], categoryId: "scat-brows" },

  // Ногти — сезонный
  { id: "bndl-008", name: "Педикюр сезонный ×2", type: "package", status: "draft", price: 3100, items: [{ serviceId: "srv-n-004", qty: 2 }], categoryId: "scat-nails" },

  // Волосы — уход после окрашивания
  { id: "bndl-009", name: "Окрашивание + ламинирование", type: "package", status: "active", price: 7200, items: [{ serviceId: "srv-h-004", qty: 1 }, { serviceId: "srv-h-005", qty: 1 }], categoryId: "scat-hair" },

  // SPA — годовая подписка
  { id: "bndl-010", name: "SPA 12 месяцев (VIP)", type: "subscription", status: "active", price: 299000, periodDays: 365, items: [{ serviceId: "srv-s-003" }], categoryId: "scat-spa" },
];

/* ===================== СПЕЦИАЛИСТЫ (мастера) ===================== */

const wk = (ranges: TimeRange[]): TimeRange[] => ranges;
const off: DayOfWeek[] = [0]; // вс — выходной по умолчанию

export const ADMIN_SPECIALISTS: AdminSpecialist[] = [
  {
    id: "sp-anna",
    name: "Анна",
    role: "top-master",
    status: "active",
    labels: ["ТОП"],
    slotSizeMin: 15,
    skills: [
      { serviceId: "srv-h-001", isActive: true },                                 // женская стрижка
      { serviceId: "srv-h-003", isActive: true },                                 // вечерняя укладка
      { serviceId: "srv-m-004", isActive: true, priceOverride: 5200 },            // свадебный макияж дороже
      { serviceId: "srv-m-002", isActive: true },                                 // вечерний макияж
      { serviceId: "srv-b-003", isActive: true },                                 // ламинирование бровей
    ],
    schedule: {
      working: {
        1: wk([{ start: "10:00", end: "20:00" }]),
        2: wk([{ start: "10:00", end: "20:00" }]),
        3: wk([{ start: "12:00", end: "20:00" }]),
        4: wk([{ start: "10:00", end: "18:00" }]),
        5: wk([{ start: "10:00", end: "18:00" }]),
        6: wk([{ start: "10:00", end: "16:00" }]),
      },
      breaks: {
        1: wk([{ start: "14:00", end: "14:30" }]),
        2: wk([{ start: "14:00", end: "14:30" }]),
        3: wk([{ start: "15:00", end: "15:30" }]),
      },
      dayOff: off,
    },
  },
  {
    id: "sp-olga",
    name: "Ольга",
    role: "master",
    status: "active",
    labels: ["Брови/Ресницы"],
    skills: [
      { serviceId: "srv-b-001", isActive: true }, // коррекция бровей
      { serviceId: "srv-b-002", isActive: true },
      { serviceId: "srv-b-004", isActive: true },
      { serviceId: "srv-n-001", isActive: true }, // маникюр
      { serviceId: "srv-n-002", isActive: true },
    ],
    schedule: {
      working: {
        1: wk([{ start: "11:00", end: "19:00" }]),
        2: wk([{ start: "11:00", end: "19:00" }]),
        3: wk([{ start: "11:00", end: "19:00" }]),
        5: wk([{ start: "10:00", end: "16:00" }]),
        6: wk([{ start: "10:00", end: "16:00" }]),
      },
      breaks: {
        1: wk([{ start: "15:00", end: "15:20" }]),
        2: wk([{ start: "15:00", end: "15:20" }]),
        3: wk([{ start: "15:00", end: "15:20" }]),
      },
      dayOff: [0, 4], // вс и чт — выходные
    },
  },
  {
    id: "sp-igor",
    name: "Игорь",
    role: "master",
    status: "active",
    labels: ["Массаж"],
    skills: [
      { serviceId: "srv-s-001", isActive: true }, // массаж спины 60
      { serviceId: "srv-s-002", isActive: true }, // общий 90
      { serviceId: "srv-s-005", isActive: true }, // скраб+обёртывание
    ],
    schedule: {
      working: {
        1: wk([{ start: "10:00", end: "18:00" }]),
        3: wk([{ start: "12:00", end: "20:00" }]),
        4: wk([{ start: "12:00", end: "20:00" }]),
        6: wk([{ start: "10:00", end: "14:00" }]),
      },
      breaks: {
        3: wk([{ start: "16:00", end: "16:20" }]),
        4: wk([{ start: "16:00", end: "16:20" }]),
      },
      dayOff: [0, 2, 5], // вс, вт, пт — выходные
    },
  },
  {
    id: "sp-lera",
    name: "Лера",
    role: "junior",
    status: "active",
    labels: ["Ногти"],
    skills: [
      { serviceId: "srv-n-001", isActive: true },
      { serviceId: "srv-n-002", isActive: true, priceOverride: 1990 }, // промо-цена у джуниора
      { serviceId: "srv-n-003", isActive: true },
      { serviceId: "srv-n-004", isActive: true, durationMinOverride: 75 }, // дольше делает педикюр
    ],
    schedule: {
      working: {
        2: wk([{ start: "10:00", end: "18:00" }]),
        3: wk([{ start: "10:00", end: "18:00" }]),
        4: wk([{ start: "10:00", end: "18:00" }]),
        5: wk([{ start: "12:00", end: "20:00" }]),
      },
      dayOff: [0,1,6],
    },
  },
  {
    id: "sp-mila",
    name: "Мила",
    role: "master",
    status: "active",
    labels: ["Макияж"],
    skills: [
      { serviceId: "srv-m-001", isActive: true },
      { serviceId: "srv-m-002", isActive: true },
      { serviceId: "srv-m-003", isActive: true },
      { serviceId: "srv-m-004", isActive: true, priceOverride: 5000 },
      { serviceId: "srv-m-005", isActive: true },
    ],
    schedule: {
      working: {
        1: wk([{ start: "12:00", end: "20:00" }]),
        2: wk([{ start: "12:00", end: "20:00" }]),
        4: wk([{ start: "10:00", end: "18:00" }]),
        6: wk([{ start: "10:00", end: "16:00" }]),
      },
      breaks: {
        1: wk([{ start: "16:00", end: "16:30" }]),
        2: wk([{ start: "16:00", end: "16:30" }]),
      },
      dayOff: [0,3,5],
    },
  },
  {
    id: "sp-max",
    name: "Максим",
    role: "master",
    status: "draft",
    labels: ["Окрашивание"],
    skills: [
      { serviceId: "srv-h-004", isActive: true }, // однотонное окрашивание
      { serviceId: "srv-h-005", isActive: true }, // ламинирование (сама услуга draft — ок для черновика)
      { serviceId: "srv-h-001", isActive: false },
    ],
    schedule: {
      working: {
        3: wk([{ start: "10:00", end: "18:00" }]),
        5: wk([{ start: "12:00", end: "20:00" }]),
      },
      dayOff: [0,1,2,4,6],
    },
  },
];

/* ===================== Удобные индексы ===================== */

export const SERVICE_BY_ID = new Map(ADMIN_SERVICES.map(s => [s.id, s]));
export const CATEGORY_BY_ID = new Map(SERVICE_CATEGORIES.map(c => [c.id, c]));
export const SPECIALIST_BY_ID = new Map(ADMIN_SPECIALISTS.map(m => [m.id, m]));

/* ===================== Хелперы для UI (без рандома) ===================== */

/** Возвращает цену/длительность для пары (услуга, специалист) с учётом оверрайдов */
export function getServiceOfferForSpecialist(serviceId: string, specialistId: string) {
  const s = SERVICE_BY_ID.get(serviceId);
  const sp = SPECIALIST_BY_ID.get(specialistId);
  if (!s || !sp) return null;
  const skill = sp.skills.find(k => k.serviceId === serviceId && k.isActive);
  if (!skill) return null;
  return {
    price: skill.priceOverride ?? s.price,
    durationMin: skill.durationMinOverride ?? s.durationMin,
  };
}

/** Услуги по категории (отфильтрованные по статусу, если нужно) */
export function servicesByCategory(categoryId: string, onlyActive = true) {
  return ADMIN_SERVICES.filter(s => s.categoryId === categoryId && (!onlyActive || s.status === "active"));
}

/** Список специалистов, кто умеет выполнять услугу (и активен) */
export function specialistsForService(serviceId: string, onlyActive = true) {
  return ADMIN_SPECIALISTS.filter(sp =>
    (!onlyActive || sp.status === "active") &&
    sp.skills.some(sk => sk.serviceId === serviceId && sk.isActive)
  );
}