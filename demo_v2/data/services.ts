// src/app/demo/data/services.ts

/* --------------------------------- Types -------------------------------- */

export type ServiceCategory =
  | "Аудит"
  | "Настройка"
  | "Интеграции"
  | "Обучение"
  | "Поддержка";

export type CancelPolicyType = "flexible" | "standard" | "strict";

export type CancelPolicy = {
  type: CancelPolicyType;
  /** За сколько минут до слота доступна бесплатная отмена (если применимо) */
  freeCancelUntilMin?: number;
  /** Комиссия при поздней отмене, % от стоимости (если применимо) */
  feePercent?: number;
};

export type Service = {
  id: string;            // стабильный идентификатор
  title: string;         // краткое имя
  price?: number;        // в валютных единицах (без копеек)
  durationMin?: number;  // длительность в минутах
  category?: ServiceCategory;
  desc?: string;
  sku?: string;          // артикул для биллинга
  slug?: string;         // для SEO/роутинга
  tags?: string[];

  /* ---- Бронирование / политика отмены ---- */
  requiresBooking?: boolean; // нужен слот в календаре
  minNoticeMin?: number;     // минимальное окно на запись (минут до начала)
  cancelPolicy?: CancelPolicy;

  /* ---- Налоги ---- */
  taxRate?: number;          // ставка НДС/налога, например 0.20 = 20%
};

/* -------------------------------- Helpers ------------------------------- */

const translitTable: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",
  с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"shch",ь:"",ы:"y",ъ:"",э:"e",ю:"yu",я:"ya",
};
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => translitTable[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// Валидная ставка налога (0..1)
const clampTax = (n?: number) =>
  typeof n === "number" && n >= 0 && n <= 1 ? n : undefined;

/* ---------- UI форматтеры (можно использовать в компонентах) ----------- */

export const formatPriceRu = (value?: number) =>
  typeof value === "number"
    ? new Intl.NumberFormat("ru-RU").format(value) + " ₽"
    : "Бесплатно";

export const durationToLabel = (min?: number) => {
  if (!min) return "—";
  if (min < 60) return `${min} мин`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
};

export const cancelPolicyToLabel = (p?: CancelPolicy) => {
  if (!p) return "Политика отмены не задана";
  const { type, freeCancelUntilMin, feePercent } = p;
  const until =
    typeof freeCancelUntilMin === "number"
      ? freeCancelUntilMin >= 60
        ? `${Math.floor(freeCancelUntilMin / 60)} ч`
        : `${freeCancelUntilMin} мин`
      : null;

  switch (type) {
    case "flexible":
      return until
        ? `Гибкая: бесплатная отмена за ${until} до начала`
        : "Гибкая: бесплатная отмена до начала";
    case "standard":
      return until
        ? `Стандартная: бесплатная отмена за ${until}, позже комиссия ${feePercent ?? 30}%`
        : `Стандартная: комиссия ${feePercent ?? 30}% при поздней отмене`;
    case "strict":
      return `Строгая: комиссия ${feePercent ?? 100}% при отмене`;
    default:
      return "Политика отмены";
  }
};

/* ---------------------------- Billing helpers --------------------------- */

/** Цена с налогом (округление до целых валютных единиц) */
export const priceWithTax = (price?: number, taxRate?: number) => {
  if (typeof price !== "number") return undefined;
  const rate = clampTax(taxRate) ?? 0;
  return Math.round(price * (1 + rate));
};

/** Строка вида «3 000 ₽ (с НДС 20%)» */
export const formatWithTaxLabel = (price?: number, taxRate?: number) => {
  const p = priceWithTax(price, taxRate);
  if (typeof p !== "number") return formatPriceRu(price);
  const rate = Math.round(((clampTax(taxRate) ?? 0) * 100));
  return `${formatPriceRu(p)}${rate ? ` (с НДС ${rate}%)` : ""}`;
};

/* ------------------------- Factory to keep fields ------------------------ */

function makeService(s: Omit<Service, "slug" | "sku"> & { sku?: string }): Service {
  const slug = slugify(s.title);
  const sku = s.sku ?? `SRV-${slug.toUpperCase().replace(/-/g, "_")}`;
  const taxRate = clampTax(s.taxRate);
  return { ...s, slug, sku, taxRate };
}

/* --------------------------------- Data -------------------------------- */

export const SERVICES: Service[] = [
  makeService({
    id: "s-2001",
    title: "Внедрение CRM — аудит",
    price: 0,
    durationMin: 60,
    category: "Аудит",
    desc: "Первичная сессия: разбор процессов, зон роста и требований к CRM.",
    tags: ["онлайн", "intro", "бесплатно"],
    sku: "SRV-CRM-AUDIT-INTRO",
    requiresBooking: true,
    minNoticeMin: 120, // запись не позднее, чем за 2 часа
    cancelPolicy: { type: "flexible", freeCancelUntilMin: 60 },
    taxRate: 0, // бесплатно, но пусть будет указано явно
  }),
  makeService({
    id: "s-2002",
    title: "Настройка воронок и прав",
    price: 3000,
    durationMin: 120,
    category: "Настройка",
    desc: "Проектируем статусы и права, включаем роли и SSO, подготавливаем тестовые данные.",
    tags: ["crm", "роли", "воронки"],
    requiresBooking: true,
    minNoticeMin: 180, // за 3 часа
    cancelPolicy: { type: "standard", freeCancelUntilMin: 120, feePercent: 30 },
    taxRate: 0.20,
  }),
  makeService({
    id: "s-2003",
    title: "Интеграции: платежи/почта/телефония",
    price: 4500,
    durationMin: 180,
    category: "Интеграции",
    desc: "Подключаем платежные провайдеры, SMTP/SendGrid, телефонию, настраиваем вебхуки.",
    tags: ["stripe", "yookassa", "twilio", "sendgrid"],
    requiresBooking: true,
    minNoticeMin: 240, // за 4 часа
    cancelPolicy: { type: "standard", freeCancelUntilMin: 180, feePercent: 40 },
    taxRate: 0.20,
  }),
  makeService({
    id: "s-2004",
    title: "Онбординг команды",
    price: 1500,
    durationMin: 90,
    category: "Обучение",
    desc: "Обучаем ключевые роли, проходим основные сценарии в CRM и мобильном приложении.",
    tags: ["обучение", "роль-менеджер", "роль-админ"],
    requiresBooking: true,
    minNoticeMin: 120,
    cancelPolicy: { type: "flexible", freeCancelUntilMin: 60 },
    taxRate: 0.20,
  }),
  makeService({
    id: "s-2005",
    title: "Дашборды и отчёты",
    price: 2200,
    durationMin: 120,
    category: "Настройка",
    desc: "Собираем KPI-дашборды, отчёты по воронкам, email-дайджесты, экспорт в BI.",
    tags: ["аналитика", "email-отчёты", "clickhouse"],
    requiresBooking: true,
    minNoticeMin: 180,
    cancelPolicy: { type: "standard", freeCancelUntilMin: 120, feePercent: 30 },
    taxRate: 0.20,
  }),
  makeService({
    id: "s-2006",
    title: "Сопровождение релиза",
    price: 1800,
    durationMin: 90,
    category: "Поддержка",
    desc: "Помогаем с выкладкой, регрессом и чек-листом Go-Live. Доступны вечерние слоты.",
    tags: ["релиз", "go-live"],
    requiresBooking: true,
    minNoticeMin: 60,
    cancelPolicy: { type: "strict", feePercent: 100 },
    taxRate: 0.20,
  }),
];

/* ------------------------------ Lookups -------------------------------- */

export const SERVICES_BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s])) as Record<
  string,
  Service
>;

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Аудит",
  "Настройка",
  "Интеграции",
  "Обучение",
  "Поддержка",
];

/* ------------------------------ Grouping -------------------------------- */

export const groupServicesByCategory = (): Record<ServiceCategory, Service[]> => {
  const map = Object.fromEntries(SERVICE_CATEGORIES.map((c) => [c, [] as Service[]])) as Record<
    ServiceCategory,
    Service[]
  >;
  for (const s of SERVICES) {
    const cat = s.category ?? "Поддержка";
    map[cat].push(s);
  }
  return map;
};