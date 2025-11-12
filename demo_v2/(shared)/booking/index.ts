// src/app/demo/admin/booking/data/mockAdminBooking.ts
// Моки и helper’ы для админского блока бронирования
// Детерминированно, «как в реальном проекте»

/* =========================================================
 *                     ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
 * =======================================================*/

// Роли видят одни и те же данные, различается UI/права
export type AdminKpi = { label: string; value: number; delta?: number; href: string };

export type AdminResource = {
  id: string;
  name: string;
  type: "staff" | "room" | "equipment" | "table" | "house";
  locationId?: string;
  capacity: number;         // параллельных слотов (сколько брони одновременно)
  services: string[];       // ids услуг
  active: boolean;
};

export type SlotTemplate = {
  id: string;
  name: string;
  /** 1..7 (пн..вс) */
  days: number[];
  start: string;            // "HH:mm"
  end: string;              // "HH:mm"
  locationId?: string;
  serviceIds: string[];
  resourceIds: string[];
  priority: number;         // 0..100
  active: boolean;
  dateFrom?: string;        // YYYY-MM-DD
  dateTo?: string;
  /** Сколько параллельных слотов создавать (если ресурс позволяет) */
  parallel?: number;
};

export type ExceptionItem = {
  id: string;
  type: "holiday" | "blackout" | "maintenance" | "personal";
  date: string;             // YYYY-MM-DD
  start?: string;           // "HH:mm"
  end?: string;             // "HH:mm"
  locationId?: string;
  resourceIds?: string[];
  reason?: string;
  active: boolean;
};

export type Reservation = {
  id: string;
  serviceId: string;
  resourceId: string;
  start: string;            // ISO
  end: string;              // ISO
  status: "new" | "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  client: string;
  href: string;             // ссылка на карточку (для менеджера)
};

export type AdminPolicy = {
  id: string;
  name: string;
  type: "cancel" | "deposit" | "leadtime" | "buffer" | "overbooking";
  params: Record<string, any>;
  level: "org" | "location" | "category" | "service" | "resource";
  appliesTo?: {
    locations?: string[];
    categories?: string[];
    services?: string[];
    resources?: string[];
  };
  active: boolean;
  updatedAt?: string;
};

/* =========================================================
 *                     ДОП. СЛОЙ ДАННЫХ (каталог бронирований)
 * =======================================================*/

/** Категории бронирования (5 шт) */
export type BookingCategory = {
  id: string;
  name: string;
  slug: string;
  position?: number;
  isActive?: boolean;
};

export const BOOKING_CATEGORIES: BookingCategory[] = [
  { id: "cat-theatre",   name: "Театр",         slug: "theatre",   position: 1, isActive: true },
  { id: "cat-restaurant",name: "Ресторан",      slug: "restaurant",position: 2, isActive: true },
  { id: "cat-concert",   name: "Концерт",       slug: "concert",   position: 3, isActive: true },
  { id: "cat-hotel",     name: "Гостиница",     slug: "hotel",     position: 4, isActive: true },
  { id: "cat-resort",    name: "База отдыха",   slug: "resort",    position: 5, isActive: true },
];

/** «Вид бронирования» (=услуга брони), по 5 в каждой категории */
export type BookingService = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  address: string;
  basePrice: number;             // базовая цена, RUB
  durationMin?: number;          // длительность слота, мин (если применимо)
  conditions: string[];          // условия/правила для клиента
  options?: Array<{ key: string; label: string; values: string[] }>; // выбор столов/номеров/мест и т.п.
  active: boolean;
};

export const ADMIN_BOOKING_SERVICES: BookingService[] = [
  // Театр
  { id: "srv-theatre-premium",  categoryId: "cat-theatre", name: "Премиум-места (партер)", slug: "theatre-premium", address: "Москва, Театральная пл., 1", basePrice: 4500, durationMin: 150, conditions: ["Обмен билетов не производится", "Возврат по тарифу —1 день: 50%"], options: [{ key: "row", label: "Ряд", values: ["1","2","3","4","5"] }, { key: "seat", label: "Место", values: ["1","2","3","4","5","6","7","8"] }], active: true },
  { id: "srv-theatre-standard", categoryId: "cat-theatre", name: "Стандарт (амфитеатр)",   slug: "theatre-standard", address: "Москва, Театральная пл., 1", basePrice: 2800, durationMin: 150, conditions: ["Электронный билет", "Посадка за 15 мин до начала"], active: true },
  { id: "srv-theatre-balcony",  categoryId: "cat-theatre", name: "Балкон",                 slug: "theatre-balcony",  address: "Москва, Театральная пл., 1", basePrice: 2000, durationMin: 150, conditions: ["Ограниченный обзор"], active: true },
  { id: "srv-theatre-vipbox",   categoryId: "cat-theatre", name: "VIP-ложа",               slug: "theatre-vipbox",   address: "Москва, Театральная пл., 1", basePrice: 12000, durationMin: 150, conditions: ["Частная ложа на 4 персоны", "Включён welcome-набор"], active: true },
  { id: "srv-theatre-matinee",  categoryId: "cat-theatre", name: "Дневной сеанс (матине)", slug: "theatre-matinee",  address: "Москва, Театральная пл., 1", basePrice: 1800, durationMin: 120, conditions: ["Семейный показ", "Дети до 6 лет бесплатно"], active: true },

  // Ресторан
  { id: "srv-restaurant-table2",  categoryId: "cat-restaurant", name: "Стол на 2",      slug: "restaurant-table-2", address: "Москва, ул. Тверская, 10", basePrice: 0, durationMin: 120, conditions: ["Депозит 2000 ₽", "Опоздание более 15 мин — бронь снимается"], options: [{ key: "zone", label: "Зона", values: ["Зал", "Терраса", "Бар"] }], active: true },
  { id: "srv-restaurant-table4",  categoryId: "cat-restaurant", name: "Стол на 4",      slug: "restaurant-table-4", address: "Москва, ул. Тверская, 10", basePrice: 0, durationMin: 120, conditions: ["Депозит 4000 ₽", "Особые пожелания укажите в комментарии"], active: true },
  { id: "srv-restaurant-table6",  categoryId: "cat-restaurant", name: "Стол на 6",      slug: "restaurant-table-6", address: "Москва, ул. Тверская, 10", basePrice: 0, durationMin: 150, conditions: ["Депозит 6000 ₽", "Группам 6+ — фикс.меню"], active: true },
  { id: "srv-restaurant-banquet", categoryId: "cat-restaurant", name: "Банкет-зал",     slug: "restaurant-banquet", address: "Москва, ул. Тверская, 10", basePrice: 30000, durationMin: 240, conditions: ["Предоплата 30%", "Собственный декор согласовать заранее"], active: true },
  { id: "srv-restaurant-chef",    categoryId: "cat-restaurant", name: "Шеф-стол (омакосе)", slug: "restaurant-chef", address: "Москва, ул. Тверская, 10", basePrice: 8500, durationMin: 150, conditions: ["Сет меню шефа", "Отмена за 24ч — удержание 20%"], active: true },

  // Концерт
  { id: "srv-concert-standing",  categoryId: "cat-concert", name: "Фан-зона (стоя)",    slug: "concert-standing", address: "Москва, пр-т Мира, 119 (АренА)", basePrice: 3200, durationMin: 180, conditions: ["Без мест", "Доступ к мерчу"], active: true },
  { id: "srv-concert-seat-a",    categoryId: "cat-concert", name: "Сектор A (сидячие)", slug: "concert-seat-a",   address: "Москва, пр-т Мира, 119 (АренА)", basePrice: 3800, durationMin: 180, conditions: ["Нумерованные места"], active: true },
  { id: "srv-concert-seat-b",    categoryId: "cat-concert", name: "Сектор B (сидячие)", slug: "concert-seat-b",   address: "Москва, пр-т Мира, 119 (АренА)", basePrice: 2900, durationMin: 180, conditions: ["Нумерованные места"], active: true },
  { id: "srv-concert-vip",       categoryId: "cat-concert", name: "VIP-ложа + lounge",  slug: "concert-vip",      address: "Москва, пр-т Мира, 119 (АренА)", basePrice: 14000, durationMin: 180, conditions: ["VIP-вход", "Фуршет"], active: true },
  { id: "srv-concert-backstage", categoryId: "cat-concert", name: "Backstage-тур",      slug: "concert-backstage",address: "Москва, пр-т Мира, 119 (АренА)", basePrice: 5000, durationMin: 45, conditions: ["Только 12 мест/слот", "Паспорт обязателен"], active: true },

  // Гостиница
  { id: "srv-hotel-standard", categoryId: "cat-hotel", name: "Стандарт (DBL)", slug: "hotel-standard", address: "Москва, наб. реки, 7", basePrice: 4200, conditions: ["Завтрак включён", "Расчётный час 12:00"], active: true },
  { id: "srv-hotel-deluxe",   categoryId: "cat-hotel", name: "Делюкс",         slug: "hotel-deluxe",   address: "Москва, наб. реки, 7", basePrice: 6800, conditions: ["Поздний выезд по запросу"], active: true },
  { id: "srv-hotel-suite",    categoryId: "cat-hotel", name: "Сьют",           slug: "hotel-suite",    address: "Москва, наб. реки, 7", basePrice: 11500, conditions: ["Доступ в lounge"], active: true },
  { id: "srv-hotel-family",   categoryId: "cat-hotel", name: "Семейный",       slug: "hotel-family",   address: "Москва, наб. реки, 7", basePrice: 7600, conditions: ["2+2", "Детская кроватка по запросу"], active: true },
  { id: "srv-hotel-late",     categoryId: "cat-hotel", name: "Поздний выезд",  slug: "hotel-late",     address: "Москва, наб. реки, 7", basePrice: 1500, durationMin: 240, conditions: ["При наличии доступности"], active: true },

  // База отдыха
  { id: "srv-resort-cabin-s",  categoryId: "cat-resort", name: "Домик «Малыш»",    slug: "resort-cabin-s",  address: "МО, оз. Лесное, 1", basePrice: 4800, conditions: ["До 2 гостей", "Мангал рядом"], active: true },
  { id: "srv-resort-cabin-f",  categoryId: "cat-resort", name: "Домик «Семейный»", slug: "resort-cabin-f",  address: "МО, оз. Лесное, 1", basePrice: 6900, conditions: ["До 5 гостей"], active: true },
  { id: "srv-resort-sauna",    categoryId: "cat-resort", name: "Сауна 2 часа",    slug: "resort-sauna",    address: "МО, оз. Лесное, 1", basePrice: 3500, durationMin: 120, conditions: ["Полотенца включены"], active: true },
  { id: "srv-resort-boat",     categoryId: "cat-resort", name: "Аренда лодки",    slug: "resort-boat",     address: "МО, оз. Лесное, 1", basePrice: 1200, durationMin: 60, conditions: ["Спасжилет обязателен"], active: true },
  { id: "srv-resort-bbq",      categoryId: "cat-resort", name: "Беседка BBQ",     slug: "resort-bbq",      address: "МО, оз. Лесное, 1", basePrice: 2000, durationMin: 180, conditions: ["Депозит 1000 ₽"], active: true },
];

/* Индексы для быстрого доступа */
export const BOOKING_SERVICE_BY_ID = new Map(ADMIN_BOOKING_SERVICES.map(s => [s.id, s]));
export const BOOKING_CATEGORY_BY_ID = new Map(BOOKING_CATEGORIES.map(c => [c.id, c]));

/* =========================================================
 *                               KPI
 * =======================================================*/

export const ADMIN_BOOKING_KPI: AdminKpi[] = [
  { label: "Средняя загрузка", value: 68, delta: +4.2, href: "/demo/admin/booking/schedules?focus=coverage" },
  { label: "Отмены", value: 7, delta: -1.1, href: "/demo/manager/reports/booking?focus=cancel" },
  { label: "No-show", value: 3, delta: +0.4, href: "/demo/manager/reports/booking?focus=noshow" },
  { label: "Дней с нехваткой слотов", value: 5, delta: +2, href: "/demo/admin/booking/schedules?week=today" },
];

/* =========================================================
 *                          РЕСУРСЫ
 * =======================================================*/

export const ADMIN_RESOURCES: AdminResource[] = [
  // Театр — персонал/ложи
  { id: "stf-usher-1",  name: "Билетер — Смена A", type: "staff", capacity: 2, services: ["srv-theatre-premium","srv-theatre-standard","srv-theatre-balcony","srv-theatre-vipbox","srv-theatre-matinee"], locationId: "loc-theatre", active: true },
  { id: "room-vip-box", name: "VIP-ложа 1",       type: "room",  capacity: 1, services: ["srv-theatre-vipbox"], locationId: "loc-theatre", active: true },

  // Ресторан — столы/шеф
  { id: "table-1", name: "Стол #1 (зал)",  type: "table", capacity: 1, services: ["srv-restaurant-table2","srv-restaurant-table4"], locationId: "loc-restaurant", active: true },
  { id: "table-5", name: "Стол #5 (терраса)", type: "table", capacity: 1, services: ["srv-restaurant-table2","srv-restaurant-table4","srv-restaurant-table6"], locationId: "loc-restaurant", active: true },
  { id: "chef-bar", name: "Шеф-стойка",   type: "table", capacity: 6, services: ["srv-restaurant-chef"], locationId: "loc-restaurant", active: true },
  { id: "banquet-hall", name: "Банкет-холл", type: "room", capacity: 40, services: ["srv-restaurant-banquet"], locationId: "loc-restaurant", active: true },

  // Концерт — зоны
  { id: "zone-fan", name: "Фан-зона", type: "room", capacity: 400, services: ["srv-concert-standing"], locationId: "loc-arena", active: true },
  { id: "sector-a", name: "Сектор A", type: "room", capacity: 200, services: ["srv-concert-seat-a"], locationId: "loc-arena", active: true },
  { id: "sector-b", name: "Сектор B", type: "room", capacity: 220, services: ["srv-concert-seat-b"], locationId: "loc-arena", active: true },
  { id: "vip-lounge", name: "VIP lounge", type: "room", capacity: 30, services: ["srv-concert-vip"], locationId: "loc-arena", active: true },

  // Гостиница — номера
  { id: "room-101", name: "Номер 101 (DBL)", type: "room", capacity: 1, services: ["srv-hotel-standard","srv-hotel-late"], locationId: "loc-hotel", active: true },
  { id: "room-305", name: "Номер 305 (Deluxe)", type: "room", capacity: 1, services: ["srv-hotel-deluxe","srv-hotel-late"], locationId: "loc-hotel", active: true },
  { id: "room-501", name: "Сьют 501", type: "room", capacity: 1, services: ["srv-hotel-suite","srv-hotel-late"], locationId: "loc-hotel", active: true },
  { id: "room-220", name: "Family 220", type: "room", capacity: 1, services: ["srv-hotel-family","srv-hotel-late"], locationId: "loc-hotel", active: true },

  // База отдыха — домики/сауна/беседки/лодки
  { id: "house-s-1", name: "Домик S-1", type: "house", capacity: 1, services: ["srv-resort-cabin-s"], locationId: "loc-resort", active: true },
  { id: "house-f-1", name: "Домик F-1", type: "house", capacity: 1, services: ["srv-resort-cabin-f"], locationId: "loc-resort", active: true },
  { id: "sauna-1",   name: "Сауна №1", type: "room", capacity: 1, services: ["srv-resort-sauna"], locationId: "loc-resort", active: true },
  { id: "bbq-1",     name: "Беседка BBQ №1", type: "room", capacity: 1, services: ["srv-resort-bbq"], locationId: "loc-resort", active: true },
  { id: "boat-1",    name: "Лодка #1", type: "equipment", capacity: 1, services: ["srv-resort-boat"], locationId: "loc-resort", active: true },
];

/* =========================================================
 *                     ШАБЛОНЫ СЛОТОВ
 * =======================================================*/

export const ADMIN_SLOT_TEMPLATES: SlotTemplate[] = [
  // Театр: вечерние показы (пт-вс), VIP-ложа —
  { id: "tpl-theatre-evening", name: "Театр — вечерние", days: [5,6,7], start: "18:00", end: "22:00", locationId: "loc-theatre", serviceIds: ["srv-theatre-premium","srv-theatre-standard","srv-theatre-balcony","srv-theatre-vipbox"], resourceIds: ["stf-usher-1","room-vip-box"], priority: 80, active: true, parallel: 1 },
  { id: "tpl-theatre-matinee", name: "Театр — матине (вс)", days: [7], start: "12:00", end: "14:30", locationId: "loc-theatre", serviceIds: ["srv-theatre-matinee"], resourceIds: ["stf-usher-1"], priority: 60, active: true, parallel: 1 },

  // Ресторан: каждый день 12–23, столы по одному слоту, шеф-стойка параллельно до 6 гостей
  { id: "tpl-rest-daily", name: "Ресторан — каждый день", days: [1,2,3,4,5,6,7], start: "12:00", end: "23:00", locationId: "loc-restaurant", serviceIds: ["srv-restaurant-table2","srv-restaurant-table4","srv-restaurant-table6"], resourceIds: ["table-1","table-5"], priority: 70, active: true, parallel: 1 },
  { id: "tpl-rest-chef", name: "Шеф-стойка", days: [4,5,6,7], start: "18:00", end: "22:00", locationId: "loc-restaurant", serviceIds: ["srv-restaurant-chef"], resourceIds: ["chef-bar"], priority: 80, active: true, parallel: 6 },
  { id: "tpl-rest-banquet", name: "Банкет-холл (по выходным)", days: [6,7], start: "12:00", end: "22:00", locationId: "loc-restaurant", serviceIds: ["srv-restaurant-banquet"], resourceIds: ["banquet-hall"], priority: 75, active: true, parallel: 1 },

  // Концерт: единые слоты для зон
  { id: "tpl-concert-show", name: "Концерт — шоу-день", days: [5,6], start: "19:00", end: "22:30", locationId: "loc-arena", serviceIds: ["srv-concert-standing","srv-concert-seat-a","srv-concert-seat-b","srv-concert-vip"], resourceIds: ["zone-fan","sector-a","sector-b","vip-lounge"], priority: 90, active: true, parallel: 1 },
  { id: "tpl-concert-backstage", name: "Backstage-туры", days: [5,6], start: "17:30", end: "18:30", locationId: "loc-arena", serviceIds: ["srv-concert-backstage"], resourceIds: ["vip-lounge"], priority: 85, active: true, parallel: 1 },

  // Гостиница: номера доступны ежедневно
  { id: "tpl-hotel-rooms", name: "Отель — номера", days: [1,2,3,4,5,6,7], start: "00:00", end: "24:00", locationId: "loc-hotel", serviceIds: ["srv-hotel-standard","srv-hotel-deluxe","srv-hotel-suite","srv-hotel-family","srv-hotel-late"], resourceIds: ["room-101","room-305","room-501","room-220"], priority: 50, active: true, parallel: 1 },

  // База отдыха: домики/сауна/беседка/лодка
  { id: "tpl-resort-houses", name: "База — домики", days: [1,2,3,4,5,6,7], start: "00:00", end: "24:00", locationId: "loc-resort", serviceIds: ["srv-resort-cabin-s","srv-resort-cabin-f"], resourceIds: ["house-s-1","house-f-1"], priority: 60, active: true, parallel: 1 },
  { id: "tpl-resort-sauna", name: "База — сауна", days: [1,2,3,4,5,6,7], start: "10:00", end: "22:00", locationId: "loc-resort", serviceIds: ["srv-resort-sauna"], resourceIds: ["sauna-1"], priority: 70, active: true, parallel: 1 },
  { id: "tpl-resort-bbq", name: "База — беседка", days: [1,2,3,4,5,6,7], start: "10:00", end: "23:00", locationId: "loc-resort", serviceIds: ["srv-resort-bbq"], resourceIds: ["bbq-1"], priority: 55, active: true, parallel: 1 },
  { id: "tpl-resort-boats", name: "База — лодка", days: [1,2,3,4,5,6,7], start: "09:00", end: "20:00", locationId: "loc-resort", serviceIds: ["srv-resort-boat"], resourceIds: ["boat-1"], priority: 65, active: true, parallel: 1 },
];

// ✅ Алиас, который требуют страницы
export const ADMIN_TEMPLATES = ADMIN_SLOT_TEMPLATES;

/* =========================================================
 *                     ИСКЛЮЧЕНИЯ / БЛЭКАУТЫ
 * =======================================================*/

export const ADMIN_EXCEPTIONS: ExceptionItem[] = [
  { id: "ex-ny", type: "holiday", date: "2025-01-01", active: true, reason: "Новый год" },
  { id: "ex-room-maint", type: "maintenance", date: "2025-10-18", start: "12:00", end: "16:00", resourceIds: ["sauna-1"], active: true, reason: "Профилактика сауны" },
  { id: "ex-arena-block", type: "blackout", date: "2025-11-15", active: true, reason: "Монтаж сцены" },
];

/* =========================================================
 *                           ПОЛИТИКИ
 * =======================================================*/

export const ADMIN_POLICIES: AdminPolicy[] = [
  // Организационные
  {
    id: "pol-leadtime",
    name: "Lead-time 2ч / max 30д",
    type: "leadtime",
    params: { minHoursBefore: 2, maxDaysAhead: 30 },
    level: "org",
    active: true,
  },
  // Локации
  {
    id: "pol-deposit-restaurant",
    name: "Ресторан: депозит 20%",
    type: "deposit",
    params: { percent: 20, refundable: true },
    level: "location",
    appliesTo: { locations: ["loc-restaurant"] },
    active: true,
    updatedAt: "2025-10-02T15:30:00Z",
  },
  // Категории
  {
    id: "pol-cancel-theatre",
    name: "Театр: отмена до 24ч (50%)",
    type: "cancel",
    params: { freeUntilHours: 24, penaltyPercent: 50 },
    level: "category",
    appliesTo: { categories: ["cat-theatre"] },
    active: true,
    updatedAt: "2025-10-01T10:00:00Z",
  },
  // Услуги
  {
    id: "pol-buffer-sauna",
    name: "Сауна: буфер до/после 15 мин",
    type: "buffer",
    params: { beforeMin: 15, afterMin: 15 },
    level: "service",
    appliesTo: { services: ["srv-resort-sauna"] },
    active: true,
  },
  // Ресурсы
  {
    id: "pol-overbooking-fan",
    name: "Фан-зона: овербукинг 5%",
    type: "overbooking",
    params: { percent: 5 },
    level: "resource",
    appliesTo: { resources: ["zone-fan"] },
    active: false, // выключено по умолчанию
  },
];

/* =========================================================
 *                        ФАКТИЧЕСКИЕ БРОНИ
 * =======================================================*/

const iso = (d: Date) => {
  const z = new Date(d);
  z.setSeconds(0, 0);
  return z.toISOString();
};
const withTime = (base: Date, h: number, m = 0) => {
  const x = new Date(base);
  x.setHours(h, m, 0, 0);
  return x;
};

/** ISO-понедельник текущей недели */
const today = new Date();
const mon = new Date(today);
mon.setDate(mon.getDate() - ((today.getDay() + 6) % 7)); // ISO Monday (1)

export const ADMIN_RESERVATIONS: Reservation[] = [
  // Театр
  {
    id: "BKG-T-1001",
    serviceId: "srv-theatre-premium",
    resourceId: "stf-usher-1",
    start: iso(withTime(mon, 18, 30)),
    end:   iso(withTime(mon, 21, 0)),
    status: "confirmed",
    client: "ООО «Культура»",
    href: "/demo/manager/booking/BKG-T-1001",
  },
  {
    id: "BKG-T-1002",
    serviceId: "srv-theatre-vipbox",
    resourceId: "room-vip-box",
    start: iso(withTime(mon, 18, 30)),
    end:   iso(withTime(mon, 21, 0)),
    status: "pending",
    client: "Группа VIP",
    href: "/demo/manager/booking/BKG-T-1002",
  },

  // Ресторан
  {
    id: "BKG-R-2001",
    serviceId: "srv-restaurant-table4",
    resourceId: "table-1",
    start: iso(withTime(mon, 19, 0)),
    end:   iso(withTime(mon, 21, 0)),
    status: "confirmed",
    client: "Дарья К.",
    href: "/demo/manager/booking/BKG-R-2001",
  },
  {
    id: "BKG-R-2002",
    serviceId: "srv-restaurant-chef",
    resourceId: "chef-bar",
    start: iso(withTime(mon, 20, 0)),
    end:   iso(withTime(mon, 22, 30)),
    status: "new",
    client: "Артём В.",
    href: "/demo/manager/booking/BKG-R-2002",
  },

  // Концерт
  {
    id: "BKG-C-3001",
    serviceId: "srv-concert-seat-a",
    resourceId: "sector-a",
    start: iso(withTime(mon, 19, 0)),
    end:   iso(withTime(mon, 22, 30)),
    status: "confirmed",
    client: "ИП Селезнёв",
    href: "/demo/manager/booking/BKG-C-3001",
  },

  // Гостиница
  {
    id: "BKG-H-4001",
    serviceId: "srv-hotel-deluxe",
    resourceId: "room-305",
    start: iso(withTime(mon, 14, 0)),
    end:   iso(withTime(mon, 14, 0 + 24)), // сутки
    status: "confirmed",
    client: "Иван П.",
    href: "/demo/manager/booking/BKG-H-4001",
  },

  // База отдыха
  {
    id: "BKG-B-5001",
    serviceId: "srv-resort-sauna",
    resourceId: "sauna-1",
    start: iso(withTime(mon, 16, 0)),
    end:   iso(withTime(mon, 18, 0)),
    status: "confirmed",
    client: "Семья Орловых",
    href: "/demo/manager/booking/BKG-B-5001",
  },
];

/* =========================================================
 *                     localStorage helpers
 * (мягкие: если SSR — тихо возвращают дефолты)
 * =======================================================*/

const safeGet = (key: string) => {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, value); } catch {}
};

const LS_KEYS = {
  templates: "admin_booking_templates",
  exceptions: "admin_booking_exceptions",
  resources: "admin_booking_resources",
  policies: "admin_booking_policies",
  services: "admin_booking_services",
  categories: "admin_booking_categories",
};

export const loadTemplates = (): SlotTemplate[] => {
  const raw = safeGet(LS_KEYS.templates);
  if (!raw) return ADMIN_SLOT_TEMPLATES;
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : ADMIN_SLOT_TEMPLATES; } catch { return ADMIN_SLOT_TEMPLATES; }
};
export const saveTemplates = (items: SlotTemplate[]) => safeSet(LS_KEYS.templates, JSON.stringify(items));

export const loadExceptions = (): ExceptionItem[] => {
  const raw = safeGet(LS_KEYS.exceptions);
  if (!raw) return ADMIN_EXCEPTIONS;
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : ADMIN_EXCEPTIONS; } catch { return ADMIN_EXCEPTIONS; }
};
export const saveExceptions = (items: ExceptionItem[]) => safeSet(LS_KEYS.exceptions, JSON.stringify(items));

export const loadResources = (): AdminResource[] => {
  const raw = safeGet(LS_KEYS.resources);
  if (!raw) return ADMIN_RESOURCES;
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : ADMIN_RESOURCES; } catch { return ADMIN_RESOURCES; }
};
export const saveResources = (items: AdminResource[]) => safeSet(LS_KEYS.resources, JSON.stringify(items));

export const loadPolicies = (): AdminPolicy[] => {
  const raw = safeGet(LS_KEYS.policies);
  if (!raw) return ADMIN_POLICIES;
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : ADMIN_POLICIES; } catch { return ADMIN_POLICIES; }
};
export const savePolicies = (items: AdminPolicy[]) => safeSet(LS_KEYS.policies, JSON.stringify(items));

// Доп: сохраним/загрузим «каталог» (категории/виды бронирований)
export const loadBookingServices = (): BookingService[] => {
  const raw = safeGet(LS_KEYS.services);
  if (!raw) return ADMIN_BOOKING_SERVICES;
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : ADMIN_BOOKING_SERVICES; } catch { return ADMIN_BOOKING_SERVICES; }
};
export const saveBookingServices = (items: BookingService[]) => safeSet(LS_KEYS.services, JSON.stringify(items));

export const loadBookingCategories = (): BookingCategory[] => {
  const raw = safeGet(LS_KEYS.categories);
  if (!raw) return BOOKING_CATEGORIES;
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : BOOKING_CATEGORIES; } catch { return BOOKING_CATEGORIES; }
};
export const saveBookingCategories = (items: BookingCategory[]) => safeSet(LS_KEYS.categories, JSON.stringify(items));

/* =========================================================
 *         Заглушка расчёта конфликтов и capacity (демо)
 * =======================================================*/

export type CapacityIssue = { resourceId: string; date: string; start: string; end: string; required: number; capacity: number };
export const computeCapacityConflicts = (): CapacityIssue[] => {
  // Здесь в реальном проекте считают пересечения резерваций с параллельной вместимостью ресурса.
  // В демо вернём пусто.
  return [];
};

/* =========================================================
 *                    Константы локаций (демо)
 * =======================================================*/
export const LOCATIONS = [
  { id: "loc-theatre", label: "Театр (Центр)" },
  { id: "loc-restaurant", label: "Ресторан (Тверская)" },
  { id: "loc-arena", label: "Арена (ВДНХ)" },
  { id: "loc-hotel", label: "Гостиница (Центр)" },
  { id: "loc-resort", label: "База отдыха (МО)" },
];