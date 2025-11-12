// app/demo/user/dashboard/data/mockUserDashboard.ts

/* =================== Расширенные типы =================== */
export type QuickAction = {
  label: string;
  description: string;
  href: string;
  intent?:
    | "booking"
    | "shop"
    | "cart"
    | "payments"
    | "favorites"
    | "notifications"
    | "profile"
    | "support"
    | "history"
    | "loyalty"
    | "locations"
    | "gallery";
  badge?: string;
  highlight?: boolean;
  count?: number;
  icon?: string; // имя иконки из lucide-react
};

export type KPI = {
  label: string;
  value: string;
  href: string;
  eyebrow?: string;
  trend?: string;
  numericValue?: number;
  targetValue?: number;
  type?: "sales" | "target" | "performance" | "premium";
};

export type BookingSummary = {
  id: string;
  service: string;
  specialist: string;
  location: string;
  date: string; // ISO yyyy-mm-dd
  dateLabel: string; // Читабельная дата
  timeLabel: string;
  status: "confirmed" | "pending" | "requires-payment" | "draft";
  statusLabel: string;
  paymentDue?: string;
  duration?: string;
  specialistRating?: number;
  address?: string;
  notes?: string;
  highlight?: boolean;
};

export type OrderSummary = {
  id: string;
  number: string;
  title: string;
  amount: string;
  status: "paid" | "processing" | "shipping" | "delivered" | "awaiting";
  statusLabel: string;
  items?: number;
  date?: string;
  trackingUrl?: string;
  service?: string;
};

export type CartItem = {
  id: string;
  title: string;
  quantity: number;
  price: string;
  category?: string;
  icon?: string; // имя иконки вместо image
};

export type CartData = {
  items: CartItem[];
  total: string;
  currency: string;
  itemCount: number;
  discount?: string;
  recommended: Array<{
    id: string;
    title: string;
    price: string;
    href: string;
    badge?: string;
    icon?: string; // имя иконки вместо image
  }>;
};

export type ServiceRecommendation = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  href: string;
  quickSlot?: string;
  duration?: string;
  category?: "beauty" | "wellness" | "premium" | "express" | "popular" | "new";
  difficulty?: "easy" | "medium" | "hard";
  rating?: number;
  featured?: boolean;
  description?: string;
  specialist?: string;
  popular?: boolean;
};

export type CalendarDay = {
  id: string; // ISO date
  date: string; // ISO date
  dayName: string;
  isToday?: boolean;
  slots: string[];
  available?: boolean;
  hasEvents?: boolean;
};

export type PaymentDue = {
  id: string;
  title: string;
  amount: string;
  dueDate: string;
  href: string;
  service?: string;
  description?: string;
  overdue?: boolean;
};

export type PaymentHistoryItem = {
  id: string;
  title: string;
  amount: string;
  date: string;
  method: string;
  status: "paid" | "pending" | "failed" | "refunded";
  service?: string;
};

export type LoyaltyData = {
  balance: string;
  currency: string;
  tier: string;
  tierLevel?: number;
  invitesUsed: number;
  invitesTotal: number;
  promoCode: string;
  perks: string[];
  nextTier?: string;
  progressToNextTier?: number;
  points?: number;
  pointsText?: string;
};

export type Announcement = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  accent?: "brand" | "success" | "warning" | "danger" | "muted";
  badge?: string;
  icon?: string; // имя иконки вместо изображения
  expiry?: string;
};

export type SupportData = {
  primaryChannel: string;
  manager: string;
  responseTime: string;
  chatHref: string;
  guideHref: string;
  status?: "online" | "away" | "offline" | "busy";
  rating?: string;
  channels?: Array<{
    name: string;
    href: string;
    icon: any; // имя иконки
    description: string;
  }>;
  availability?: string;
  features?: string[];
};

export type UserProfile = {
  name: string;
  status: string;
  nextBookingLabel: string;
  nextBookingId: string;
  membership?: "premium" | "vip" | "standard" | "new";
  points?: number;
  joinDate?: string;
  achievements?: string[];
  email?: string;
  phone?: string;
  avatarIcon?: string; // имя иконки вместо avatarUrl
};

export type MockUserDashboard = {
  user: UserProfile;
  quickActions: QuickAction[];
  kpis: KPI[];
  nextBooking: BookingSummary | null;
  orders: OrderSummary[];
  cart: CartData;
  services: ServiceRecommendation[];
  calendar: {
    weekStartLabel: string;
    days: CalendarDay[];
    upcomingEvents?: number;
  };
  payments: {
    due: PaymentDue[];
    history: PaymentHistoryItem[];
  };
  loyalty: LoyaltyData;
  announcements: Announcement[];
  support: SupportData;
  stats?: {
    totalBookings: number;
    completedServices: number;
    loyaltyPoints: number;
    savedAmount: string;
  };
};

/* =================== Хелперы дат/денег (локаль: RU) =================== */

// Единая точка правды для префикса роутов
export const ROUTE_PREFIX = "/demo/user";
const R = ROUTE_PREFIX;

const RU_WEEKDAYS_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"] as const;
const RU_WEEKDAYS_FULL = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
] as const;
const RU_MONTHS_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;
const RU_MONTHS_SHORT = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
] as const;

// yyyy-mm-dd (локально)
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

function formatShortDateLabel(d: Date): string {
  const wd = RU_WEEKDAYS_SHORT[d.getDay()];
  const day = d.getDate();
  const month = RU_MONTHS_GEN[d.getMonth()];
  return `${wd}, ${day} ${month}`;
}

function formatLongDate(d: Date) {
  const wd = RU_WEEKDAYS_FULL[d.getDay()];
  const day = d.getDate();
  const month = RU_MONTHS_GEN[d.getMonth()];
  return `${wd}, ${day} ${month}`;
}

function formatDueDateLabel(d: Date): string {
  const day = d.getDate();
  const month = RU_MONTHS_GEN[d.getMonth()];
  return `Оплатить до ${day} ${month}`;
}

function formatMoney(n: number, currency = "₽") {
  return `${n.toLocaleString("ru-RU").replace(/\s/g, " ")} ${currency}`;
}

function weekRangeLabel(anyDay: Date): string {
  const day = anyDay.getDay();
  const mondayShift = day === 0 ? -6 : 1 - day;
  const monday = addDays(anyDay, mondayShift);
  const sunday = addDays(monday, 6);
  const m1 = monday.getMonth();
  const m2 = sunday.getMonth();
  const day1 = monday.getDate();
  const day2 = sunday.getDate();
  if (m1 === m2) {
    return `${day1}—${day2} ${RU_MONTHS_GEN[monday.getMonth()]}`;
  }
  return `${day1} ${RU_MONTHS_GEN[m1]} — ${day2} ${RU_MONTHS_GEN[m2]}`;
}

function timeLabel(hh = 14, mm = 0) {
  return `${pad2(hh)}:${pad2(mm)}`;
}

/* =================== Детерминированный PRNG =================== */
/** mulberry32 — стабильный генератор на базе seed */
function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededInt(rand: () => number, min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

/* =================== Построитель моков =================== */

/**
 * Генерирует актуальные на сегодня данные. ВАЖНО:
 * использует детерминированный PRNG, чтобы избежать «дрожания» данных.
 */
export function buildMockUserDashboard(now: Date = new Date()): MockUserDashboard {
  // «Сегодня» (локально)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isoToday = toISODate(today);
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  // seed по дате (YYYYMMDD)
  const seed = Number(
    `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
      today.getDate()
    ).padStart(2, "0")}`
  );
  const rand = mulberry32(seed);

  // Неделя (Пн—Вс), содержащая «сегодня»
  const day = today.getDay();
  const mondayShift = day === 0 ? -6 : 1 - day;
  const monday = addDays(today, mondayShift);

  const weekDays: CalendarDay[] = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const iso = toISODate(d);
    const wd = d.getDay();

    const isWeekend = wd === 0 || wd === 6;
    const baseSlots = isWeekend ? 2 : 4;

    const available = rand() > 0.2; // 80% доступны, стабильно внутри дня
    const slotCount = available ? seededInt(rand, 1, baseSlots) : 0;

    const slots = Array.from({ length: slotCount }, (_, j) => {
      const baseHour = isWeekend ? 11 : 9;
      const hour = baseHour + j * 2 + (j > 1 ? 1 : 0);
      return timeLabel(hour, j % 2 === 0 ? 0 : 30);
    });

    return {
      id: iso,
      date: iso,
      dayName: RU_WEEKDAYS_SHORT[wd],
      isToday: iso === isoToday,
      slots,
      available: slotCount > 0,
      hasEvents: rand() > 0.5,
    };
  });

  // Ближайшая запись
  const nextBookingDateISO = toISODate(tomorrow);
  const nextBookingLabel = `Ближайшая запись: ${formatShortDateLabel(
    tomorrow
  )} — SPA-комплекс`;

  // Корзина — без изображений, только иконки
  const cartItems: CartItem[] = [
    {
      id: "cart-1",
      title: "Скраб цитрусовый",
      quantity: 1,
      price: formatMoney(1650),
      category: "Уход",
      icon: "FlaskConical",
    },
    {
      id: "cart-2",
      title: "Маска питательная",
      quantity: 2,
      price: formatMoney(2400),
      category: "Уход",
      icon: "SprayCan",
    },
  ];
  const cartTotal = formatMoney(1650 + 2 * 2400);

  // Платежи
  const dueDate = addDays(tomorrow, 1);

  const data: MockUserDashboard = {
    user: {
      name: "Анна Петрова",
      status: "Премиум участник",
      nextBookingLabel,
      nextBookingId: "bk-1032",
      membership: "premium",
      points: 1250,
      joinDate: "15.03.2023",
      achievements: ["Мастер релакса", "Постоянный клиент", "Эксперт спа"],
      email: "anna.p@example.com",
      phone: "+7 (912) 345-67-89",
      avatarIcon: "User",
    },

    quickActions: [
      {
        label: "Записаться",
        description: "Подберите услугу и время",
        href: `${R}/booking?intent=quick`,
        highlight: true,
        intent: "booking",
        badge: "популярно",
        icon: "CalendarDays",
      },
      {
        label: "Магазин",
        description: "Товары для ухода",
        href: `${R}/shop?utm=qa`,
        intent: "shop",
        count: 12,
        icon: "ShoppingBag",
      },
      {
        label: "Корзина",
        description: `${cartItems.length} позиции, ${cartTotal}`,
        href: `${R}/cart`,
        count: cartItems.length,
        intent: "cart",
        icon: "ShoppingCart",
      },
      {
        label: "Оплата",
        description: "Счёт на 1 200 ₽",
        href: `${R}/checkout?status=due&invoiceId=inv-203`,
        badge: "новое",
        intent: "payments",
        icon: "CreditCard",
      },
      {
        label: "Избранное",
        description: "Сохраненные услуги",
        href: `${R}/favorites`,
        intent: "favorites",
        count: 5,
        icon: "Heart",
      },
      {
        label: "Уведомления",
        description: "Новые сообщения",
        href: `${R}/notifications`,
        intent: "notifications",
        count: 3,
        icon: "Bell",
      },
    ],

    kpis: [
      {
        label: "Бонусный баланс",
        value: `${formatMoney(1250)}`,
        href: `${R}/loyalty`,
        eyebrow: "Баланс",
        trend: "+120 за месяц",
        numericValue: 1250,
        type: "premium",
      },
      {
        label: "Активные заказы",
        value: "2",
        href: `${R}/my-orders?status=active`,
        eyebrow: "Заказы",
        trend: "Последний — 2 дня назад",
        numericValue: 2,
        targetValue: 5,
        type: "sales",
      },
      {
        label: "Ближайшая запись",
        value: "завтра",
        href: `${R}/dashboard#next-booking`,
        eyebrow: "Расписание",
        trend: "14:00",
        type: "performance",
      },
      {
        label: "Прогресс целей",
        value: "75%",
        href: `${R}/profile?tab=goals`,
        eyebrow: "Достижения",
        trend: "+15% за неделю",
        numericValue: 75,
        targetValue: 100,
        type: "target",
      },
      {
        label: "Сэкономлено",
        value: formatMoney(4200),
        href: `${R}/loyalty`,
        eyebrow: "Экономия",
        trend: "С акциями",
        numericValue: 4200,
        type: "sales",
      },
    ],

    nextBooking: {
      id: "bk-1032",
      service: "SPA-комплекс Премиум — 90 минут",
      specialist: "Ольга Иванова",
      location: "Пресненская наб., 12",
      date: nextBookingDateISO,
      dateLabel: formatLongDate(tomorrow),
      timeLabel: "14:00",
      status: "confirmed",
      statusLabel: "Подтверждена",
      duration: "90 минут",
      specialistRating: 4.9,
      address: "Москва, Пресненская набережная, 12, этаж 3",
      notes:
        "Предварительная консультация включена. Рекомендуем взять с собой купальник.",
      highlight: true,
    },

    orders: [
      {
        id: "ord-5021",
        number: "№1052",
        title: "Набор «SPA at Home» — полный комплект",
        amount: formatMoney(6480),
        status: "shipping",
        statusLabel: "Доставляется",
        items: 3,
        date: "2024-01-15",
        trackingUrl: `${R}/my-orders/ord-5021/tracking`,
        service: "Доставка товаров",
      },
      {
        id: "ord-5016",
        number: "№1046",
        title: "Подарочный сертификат Премиум",
        amount: formatMoney(3000),
        status: "paid",
        statusLabel: "Оплачен",
        items: 1,
        date: "2024-01-10",
        service: "Цифровой товар",
      },
      {
        id: "ord-4988",
        number: "№1038",
        title: "Абонемент на 4 визита + 1 в подарок",
        amount: formatMoney(12900),
        status: "processing",
        statusLabel: "Готовим",
        items: 1,
        date: "2024-01-05",
        service: "Услуги",
      },
      {
        id: "ord-4972",
        number: "№1021",
        title: "Набор для ухода «Утро»",
        amount: formatMoney(5400),
        status: "delivered",
        statusLabel: "Доставлен",
        items: 4,
        date: "2023-12-28",
        service: "Доставка товаров",
      },
    ],

    cart: {
      items: cartItems,
      total: cartTotal,
      currency: "RUB",
      itemCount: 3,
      discount: formatMoney(500),
      recommended: [
        {
          id: "rec-1",
          title: "Сыворотка 24/7",
          price: formatMoney(1490),
          href: `${R}/shop/product/serum-247`,
          badge: "хит",
          icon: "FlaskConical",
        },
        {
          id: "rec-2",
          title: "Аромасвеча «Амбер»",
          price: formatMoney(980),
          href: `${R}/shop/product/candle-amber`,
          badge: "новинка",
          icon: "Candlestick",
        },
        {
          id: "rec-3",
          title: "Масло для массажа",
          price: formatMoney(2200),
          href: `${R}/shop/product/massage-oil`,
          badge: "премиум",
          icon: "Droplet",
        },
      ],
    },

    services: [
      {
        id: "svc-1",
        title: "Массаж Balance Pro",
        subtitle: "Глубокое расслабление и восстановление",
        price: formatMoney(3500),
        href: `${R}/booking?service=balance`,
        quickSlot: "Завтра, 18:00",
        duration: "60 минут",
        category: "wellness",
        difficulty: "easy",
        rating: 4.8,
        featured: true,
        description:
          "Профессиональный массаж для снятия напряжения и восстановления мышечного тонуса.",
        specialist: "Ольга Иванова",
        popular: true,
      },
      {
        id: "svc-2",
        title: "Чистка лица PRO+",
        subtitle: "Профессиональный уход с аппаратной чисткой",
        price: formatMoney(4200),
        href: `${R}/booking?service=face-pro`,
        quickSlot: `${formatShortDateLabel(dayAfterTomorrow)}, 12:00`,
        duration: "90 минут",
        category: "beauty",
        difficulty: "medium",
        rating: 4.9,
        description:
          "Комплексная чистка лица с использованием профессионального оборудования.",
        specialist: "Елена Смирнова",
      },
      {
        id: "svc-3",
        title: "Йога в парке Премиум",
        subtitle: "Индивидуальные занятия на свежем воздухе",
        price: formatMoney(1300),
        href: `${R}/booking?service=yoga`,
        quickSlot: `${RU_WEEKDAYS_SHORT[6]}, 10:30`,
        duration: "75 минут",
        category: "wellness",
        difficulty: "medium",
        rating: 4.7,
        popular: true,
      },
      {
        id: "svc-4",
        title: "SPA-комплекс Императорский",
        subtitle: "Эксклюзивный комплекс премиум-услуг",
        price: formatMoney(6900),
        href: `${R}/booking?service=spa-complex`,
        quickSlot: `${RU_WEEKDAYS_SHORT[0]}, 15:00`,
        duration: "120 минут",
        category: "premium",
        difficulty: "easy",
        rating: 5.0,
        featured: true,
        description:
          "Эксклюзивный комплекс процедур с использованием премиальных косметических средств.",
        specialist: "Мария Эксклюзив",
      },
      {
        id: "svc-5",
        title: "Экспресс-маникюр",
        subtitle: "Быстрый уход за 30 минут",
        price: formatMoney(1200),
        href: `${R}/booking?service=express-manicure`,
        quickSlot: "Сегодня, 17:00",
        duration: "30 минут",
        category: "express",
        difficulty: "easy",
        rating: 4.6,
      },
    ],

    calendar: {
      weekStartLabel: weekRangeLabel(today),
      days: weekDays,
      upcomingEvents: 3,
    },

    payments: {
      due: [
        {
          id: "inv-203",
          title: "Предоплата за SPA-комплекс Императорский",
          amount: formatMoney(1200),
          dueDate: formatDueDateLabel(dueDate),
          href: `${R}/checkout?invoiceId=inv-203`,
          service: "SPA-услуги",
          description: "Предварительная оплата для бронирования времени",
        },
        {
          id: "inv-204",
          title: "Абонемент на массаж",
          amount: formatMoney(5000),
          dueDate: formatDueDateLabel(addDays(today, 3)),
          href: `${R}/checkout?invoiceId=inv-204`,
          service: "Массажные услуги",
          description: "Оплата абонемента на 5 сеансов массажа",
        },
      ],
      history: [
        {
          id: "pay-1",
          title: "Абонемент: 4 визита + 1 в подарок",
          amount: formatMoney(12900),
          date: relDate(today, 18),
          method: "Картой *8123",
          status: "paid",
          service: "Услуги",
        },
        {
          id: "pay-2",
          title: "Сыворотка 24/7",
          amount: formatMoney(1490),
          date: relDate(today, 23),
          method: "Apple Pay",
          status: "paid",
          service: "Товары",
        },
        {
          id: "pay-3",
          title: "Подарочный сертификат",
          amount: formatMoney(3000),
          date: relDate(today, 29),
          method: "ЮKassa",
          status: "refunded",
          service: "Цифровые товары",
        },
        {
          id: "pay-4",
          title: "Консультация специалиста",
          amount: formatMoney(500),
          date: relDate(today, 35),
          method: "СБП",
          status: "paid",
          service: "Услуги",
        },
      ],
    },

    loyalty: {
      balance: "1 250",
      currency: "₽",
      tier: "Gold",
      tierLevel: 2,
      invitesUsed: 3,
      invitesTotal: 5,
      promoCode: "ONEFRIEND25",
      perks: [
        "Бесплатное продление 1 услуги в месяц",
        "Пригласи друга и получи 500 ₽ на счет",
        "Доступ к закрытым слотам записи",
        "Персональный менеджер",
        "Приоритетная поддержка 24/7",
      ],
      nextTier: "Platinum",
      progressToNextTier: 65,
      points: 1250,
      pointsText: "1 250 доступно для использования",
    },

    announcements: [
      {
        id: "ann-1",
        title: "-15% на все услуги в будни",
        description:
          "Скидка действует до конца месяца на все дневные записи с 10:00 до 16:00.",
        href: `${R}/booking?tag=weekday`,
        cta: "Выбрать слот",
        accent: "brand",
        badge: "акция",
        icon: "BadgePercent",
        expiry: "31.01.2024",
      },
      {
        id: "ann-2",
        title: "Новая коллекция уходовой косметики",
        description:
          "Добавили 12 эксклюзивных средств для домашнего ухода от ведущих брендов.",
        href: `${R}/shop?category=care`,
        cta: "Открыть каталог",
        accent: "success",
        badge: "новинка",
        icon: "Sparkles",
      },
      {
        id: "ann-3",
        title: "Обновление премиум-залов",
        description:
          "Завершили реновацию VIP-зон. Теперь еще комфортнее и технологичнее.",
        href: `${R}/about/premium-rooms`,
        cta: "Посмотреть",
        accent: "warning",
        badge: "обновление",
        icon: "Crown",
      },
    ],

    support: {
      primaryChannel: "Чат поддержки Премиум",
      manager: "София из команды OneStack",
      responseTime: "Среднее время ответа — 2 минуты",
      chatHref: `${R}/help?intent=chat`,
      guideHref: `${R}/help#faq`,
      status: "online",
      rating: "4.9",
      availability: "24/7",
      features: ["Конфиденциально", "Безопасно", "Быстро", "AI-помощник"],
      channels: [
        {
          name: "Чат",
          href: `${R}/help/chat`,
          icon: "MessageCircle",
          description: "Мгновенная помощь онлайн",
        },
        {
          name: "Телефон",
          href: `${R}/help/phone`,
          icon: "Phone",
          description: "Звонок специалисту",
        },
        {
          name: "Email",
          href: `${R}/help/email`,
          icon: "Mail",
          description: "Подробный ответ в течение часа",
        },
        {
          name: "База знаний",
          href: `${R}/help/knowledge`,
          icon: "BookOpen",
          description: "Статьи и гайды",
        },
      ],
    },

    stats: {
      totalBookings: 24,
      completedServices: 18,
      loyaltyPoints: 1250,
      savedAmount: formatMoney(4200),
    },
  };

  return data;
}

/* =================== Вспомогательные локальные функции =================== */

function relDate(today: Date, daysAgo: number) {
  const d = addDays(today, -daysAgo);
  const day = d.getDate();
  const monthShort = RU_MONTHS_SHORT[d.getMonth()];
  return `${day} ${monthShort}`;
}

/* =================== Экспорт «как раньше» =================== */

// Экземпляр по умолчанию (с «сегодня»)
export const mockUserDashboard: MockUserDashboard = buildMockUserDashboard();

// Дополнительные утилиты для тестирования
export const createMockForDate = (date: Date) => buildMockUserDashboard(date);
export const createEmptyMock = (): MockUserDashboard => ({
  user: {
    name: "",
    status: "",
    nextBookingLabel: "",
    nextBookingId: "",
    avatarIcon: "User",
  },
  quickActions: [],
  kpis: [],
  nextBooking: null,
  orders: [],
  cart: {
    items: [],
    total: "0 ₽",
    currency: "RUB",
    itemCount: 0,
    recommended: [],
  },
  services: [],
  calendar: {
    weekStartLabel: "",
    days: [],
  },
  payments: {
    due: [],
    history: [],
  },
  loyalty: {
    balance: "0",
    currency: "₽",
    tier: "Standard",
    invitesUsed: 0,
    invitesTotal: 0,
    promoCode: "",
    perks: [],
  },
  announcements: [],
  support: {
    primaryChannel: "",
    manager: "",
    responseTime: "",
    chatHref: "",
    guideHref: "",
  },
});