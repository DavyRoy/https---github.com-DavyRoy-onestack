// src/app/demo/user/shop/data/mockUserShop.ts
/* -------------------------------- Types -------------------------------- */

export type ProductVariant = {
  id: string;
  label: string;
  priceModifier?: number;
  inStock?: boolean;
  image?: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;        // 1..5
  createdAt: string;     // ISO date
  text: string;
  avatar?: string;
  verified?: boolean;
};

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  brand: string;
  categoryId: string;
  tags: string[];
  price: number;         // base price, minor units = RUB
  oldPrice?: number;
  currency: "RUB";
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  badge?: "new" | "sale" | "limited" | "popular";
  inStock: boolean;
  thumbnail: string;     // cover image URL
  images: string[];      // gallery
  description: string;
  highlights: string[];
  ingredients?: string[];
  specs: Array<{ label: string; value: string }>;
  variants?: ProductVariant[];
  suggestions: string[]; // product IDs
  related: string[];     // product IDs
  featured?: boolean;
  stockLevel?: "low" | "medium" | "high";
  delivery?: {
    free: boolean;
    days: number;
    express?: boolean;
  };
};

export type ShopData = {
  products: ShopProduct[];
  brands: string[];
  tags: string[];
  priceRange: { min: number; max: number };
  reviews: Record<string, ProductReview[]>;
  stats: {
    totalProducts: number;
    totalBrands: number;
    totalCategories: number;
    averageRating: number;
  };
};

export const SHOP_SORT_OPTIONS = [
  { value: "popular",     label: "Популярное" },
  { value: "price_asc",   label: "Сначала дешевле" },
  { value: "price_desc",  label: "Сначала дороже" },
  { value: "new",         label: "Новинки" },
  { value: "rating_desc", label: "Высокий рейтинг" },
] as const;

export type SortKey = typeof SHOP_SORT_OPTIONS[number]["value"];

/* ------------------------------- Icon helpers ------------------------------- */

/**
 * Генератор минималистичных иконок в едином стиле.
 * — Без внешних зависимостей, только SVG.
 * — Адаптирован под тёмную тему портала.
 */
function dataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type IconKind =
  | "set"
  | "serum"
  | "candle"
  | "mask"
  | "scrub"
  | "gift"
  | "oil"
  | "tea"
  | "bath"
  | "cream"
  | "perfume"
  | "accessory";

function iconSvg(kind: IconKind, opts?: { bg?: string; fg?: string; acc?: string }) {
  // Цветовая палитра из вашей дизайн-системы
  const bg = opts?.bg ?? "#050911";        // основной фон admin-shell
  const card = "#0F172A";                  // панельный фон
  const fg = opts?.fg ?? "#60A5FA";        // основной акцент (синий)
  const acc = opts?.acc ?? "#34D399";      // дополнительный акцент (зеленый)
  const grid = "#FFFFFF08";

  // общий «карточный» фон + лёгкая сетка + блинг
  const base = `
    <rect x="0" y="0" width="640" height="480" fill="${bg}"/>
    <rect x="32" y="32" rx="24" ry="24" width="576" height="416" fill="${card}" stroke="#FFFFFF12" stroke-width="1"/>
    <g opacity="0.15">
      ${Array.from({length:6}).map((_,i)=>`<line x1="${96+i*72}" y1="48" x2="${96+i*72}" y2="432" stroke="${grid}" />`).join("")}
      ${Array.from({length:5}).map((_,i)=>`<line x1="64" y1="${96+i*64}" x2="576" y2="${96+i*64}" stroke="${grid}" />`).join("")}
    </g>
    <radialGradient id="g" cx="100%" cy="0%" r="120%">
      <stop offset="0%" stop-color="#FFFFFF20"/><stop offset="60%" stop-color="#FFFFFF00"/>
    </radialGradient>
    <rect x="32" y="32" width="576" height="416" fill="url(#g)" />
  `;

  // простые эмблемы в современном стиле
  const emblem: Record<IconKind, string> = {
    set: `
      <rect x="160" y="160" width="136" height="176" rx="16" fill="${fg}" opacity="0.15" stroke="${fg}" stroke-width="3"/>
      <rect x="344" y="140" width="136" height="196" rx="16" fill="${acc}" opacity="0.15" stroke="${acc}" stroke-width="3"/>
      <path d="M200 196 h56 M200 228 h56 M200 260 h56" stroke="${fg}" stroke-width="6" stroke-linecap="round"/>
      <path d="M376 182 h72 M376 214 h72 M376 246 h72" stroke="${acc}" stroke-width="6" stroke-linecap="round"/>
    `,
    serum: `
      <rect x="260" y="150" width="120" height="220" rx="20" fill="${fg}" opacity="0.15" stroke="${fg}" stroke-width="3"/>
      <rect x="280" y="130" width="80" height="30" rx="8" fill="${fg}" opacity="0.25"/>
      <path d="M320 110 v20" stroke="${fg}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="320" cy="260" r="52" fill="${fg}" opacity="0.1"/>
      <path d="M320 215 a45 45 0 1 0 0.1 0" stroke="${fg}" stroke-width="7" fill="none"/>
    `,
    candle: `
      <rect x="236" y="164" width="168" height="206" rx="20" fill="${acc}" opacity="0.12" stroke="${acc}" stroke-width="3"/>
      <path d="M320 130 c-10 18 -10 26 0 44 c10 -18 10 -26 0 -44" fill="${acc}" />
      <path d="M280 190 h80" stroke="${acc}" stroke-width="7" stroke-linecap="round"/>
      <path d="M280 222 h80" stroke="${acc}" stroke-width="7" stroke-linecap="round" opacity="0.7"/>
    `,
    mask: `
      <rect x="180" y="190" width="280" height="160" rx="32" fill="${fg}" opacity="0.12" stroke="${fg}" stroke-width="3"/>
      <path d="M220 250 q100 40 200 0" stroke="${fg}" stroke-width="7" fill="none"/>
      <circle cx="260" cy="250" r="10" fill="${fg}"/>
      <circle cx="380" cy="250" r="10" fill="${fg}"/>
    `,
    scrub: `
      <rect x="200" y="140" width="240" height="230" rx="24" fill="${acc}" opacity="0.12" stroke="${acc}" stroke-width="3"/>
      ${Array.from({length:24}).map((_,i)=>{
        const x=220+(i%8)*26; const y=170+Math.floor(i/8)*26;
        return `<circle cx="${x}" cy="${y}" r="3" fill="${acc}" opacity="0.6"/>`;
      }).join("")}
    `,
    gift: `
      <rect x="180" y="180" width="280" height="180" rx="18" fill="${fg}" opacity="0.12" stroke="${fg}" stroke-width="3"/>
      <path d="M320 180 v180 M180 260 h280" stroke="${fg}" stroke-width="8"/>
      <path d="M300 190 c-30 -40 30 -40 20 0 M340 190 c30 -40 -30 -40 -20 0" stroke="${fg}" stroke-width="6" fill="none"/>
    `,
    oil: `
      <rect x="250" y="150" width="140" height="220" rx="24" fill="${acc}" opacity="0.12" stroke="${acc}" stroke-width="3"/>
      <rect x="270" y="130" width="100" height="30" rx="8" fill="${acc}" opacity="0.25"/>
      <path d="M320 230 q30 30 0 60 q-30 -30 0 -60" fill="${acc}" opacity="0.4"/>
    `,
    tea: `
      <rect x="200" y="200" width="260" height="140" rx="20" fill="${fg}" opacity="0.12" stroke="${fg}" stroke-width="3"/>
      <path d="M420 230 a20 20 0 1 1 0 40" stroke="${fg}" stroke-width="5" fill="none"/>
      <path d="M250 180 q20 -20 40 0 q20 -20 40 0" stroke="${fg}" stroke-width="5" fill="none"/>
    `,
    bath: `
      <rect x="180" y="160" width="280" height="200" rx="24" fill="${acc}" opacity="0.12" stroke="${acc}" stroke-width="3"/>
      <path d="M200 220 h240 M200 260 h240 M200 300 h240" stroke="${acc}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
    `,
    cream: `
      <rect x="240" y="140" width="160" height="240" rx="20" fill="${fg}" opacity="0.12" stroke="${fg}" stroke-width="3"/>
      <circle cx="320" cy="260" r="40" fill="${fg}" opacity="0.2"/>
      <path d="M320 220 v80 M280 260 h80" stroke="${fg}" stroke-width="6" stroke-linecap="round"/>
    `,
    perfume: `
      <rect x="220" y="160" width="200" height="200" rx="24" fill="${acc}" opacity="0.12" stroke="${acc}" stroke-width="3"/>
      <path d="M320 140 v40 M280 200 a40 40 0 1 0 80 0" stroke="${acc}" stroke-width="6" fill="none"/>
    `,
    accessory: `
      <rect x="200" y="180" width="240" height="160" rx="20" fill="${fg}" opacity="0.12" stroke="${fg}" stroke-width="3"/>
      <circle cx="280" cy="260" r="20" fill="${fg}" opacity="0.3"/>
      <circle cx="360" cy="260" r="20" fill="${acc}" opacity="0.3"/>
    `,
  };

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    ${base}
    <g transform="translate(0,0)">
      ${emblem[kind]}
    </g>
  </svg>`;
}

// Палитры под «варианты» в галерее
const THEME = {
  brand: { fg: "#60A5FA", acc: "#34D399" },    // синий + зеленый
  warm:  { fg: "#F59E0B", acc: "#EF4444" },    // оранжевый + красный
  calm:  { fg: "#8B5CF6", acc: "#EC4899" },    // фиолетовый + розовый
  fresh: { fg: "#06B6D4", acc: "#10B981" },    // голубой + изумрудный
};

/* ------------------------------- Products ------------------------------- */

const products: ShopProduct[] = [
  {
    id: "prod-balance-set",
    slug: "spa-balance-set",
    title: "SPA-комплект Balance",
    subtitle: "Домашний ритуал на 6 шагов",
    brand: "One Rituals",
    categoryId: "rituals-aroma",
    tags: ["арома", "релакс", "набор", "подарок"],
    price: 6890,
    oldPrice: 7490,
    currency: "RUB",
    rating: 4.9,
    reviewsCount: 128,
    badge: "sale",
    inStock: true,
    isNew: true,
    featured: true,
    stockLevel: "high",
    thumbnail: dataUri(iconSvg("set", { fg: THEME.brand.fg, acc: THEME.brand.acc })),
    images: [
      dataUri(iconSvg("set", { fg: THEME.brand.fg, acc: THEME.brand.acc })),
      dataUri(iconSvg("set", { fg: THEME.calm.fg,  acc: THEME.calm.acc })),
    ],
    description:
      "Полный набор для вечернего SPA-догляда с ароматерапией, массажем и восстановлением кожи. Подходит для чувствительной кожи. Идеально для подарка или личного использования.",
    highlights: ["6 полноразмерных средств", "Инструкция по ритуалу", "Упаковка-подарок", "Экологичные материалы"],
    ingredients: ["Эфирные масла бергамота", "Масло жожоба", "Экстракт лаванды", "Натуральные воски"],
    specs: [
      { label: "Тип кожи", value: "Нормальная, сухая" },
      { label: "Объём", value: "6 x 50 мл" },
      { label: "Производство", value: "Италия" },
      { label: "Срок годности", value: "24 месяца" },
    ],
    variants: [
      { id: "standard", label: "Стандарт", inStock: true },
      { id: "deluxe", label: "Deluxe + свеча", priceModifier: 1200, inStock: true },
    ],
    delivery: {
      free: true,
      days: 3,
      express: true
    },
    suggestions: ["prod-candle-amber", "prod-serum-247", "prod-bath-salt"],
    related: ["prod-scrub-citrus", "prod-mask-renewal", "prod-oil-warm"],
  },
  {
    id: "prod-serum-247",
    slug: "serum-247",
    title: "Сыворотка 24/7 Glow",
    subtitle: "Витамин C + Niacinamide",
    brand: "Skin Lab",
    categoryId: "face-serums",
    tags: ["сыворотка", "сияние", "витамины", "уход"],
    price: 3490,
    oldPrice: 3990,
    currency: "RUB",
    rating: 4.8,
    reviewsCount: 92,
    badge: "sale",
    inStock: true,
    featured: true,
    stockLevel: "medium",
    thumbnail: dataUri(iconSvg("serum", { fg: THEME.fresh.fg })),
    images: [
      dataUri(iconSvg("serum", { fg: THEME.fresh.fg })),
      dataUri(iconSvg("serum", { fg: THEME.calm.fg })),
    ],
    description:
      "Лёгкая сыворотка на водной основе с 15% витамином C и ниацинамидом. Выравнивает тон и придаёт коже здоровое сияние. Подходит для ежедневного использования.",
    highlights: ["Антиоксидантная защита", "Улучшает тон кожи", "Без липкости", "Гипоаллергенная формула"],
    ingredients: ["Витамин C", "Ниацинамид", "Экстракт зелёного чая", "Гиалуроновая кислота"],
    specs: [
      { label: "Тип кожи", value: "Все типы" },
      { label: "Объём", value: "30 мл" },
      { label: "Текстура", value: "Лёгкая" },
      { label: "SPF", value: "Нет" },
    ],
    delivery: {
      free: false,
      days: 2,
      express: true
    },
    suggestions: ["prod-mask-renewal", "prod-gift-card", "prod-cream-hydra"],
    related: ["prod-mask-renewal", "prod-balance-set", "prod-perfume-essence"],
  },
  {
    id: "prod-candle-amber",
    slug: "candle-amber",
    title: "Аромасвеча Amber Rest",
    subtitle: "Амбра • Ваниль • Табак",
    brand: "One Rituals",
    categoryId: "body-candles",
    tags: ["арома", "релакс", "свеча", "декор"],
    price: 1980,
    currency: "RUB",
    rating: 4.7,
    reviewsCount: 64,
    badge: "popular",
    inStock: true,
    stockLevel: "low",
    thumbnail: dataUri(iconSvg("candle", { acc: THEME.warm.fg })),
    images: [
      dataUri(iconSvg("candle", { acc: THEME.warm.fg })),
      dataUri(iconSvg("candle", { acc: THEME.brand.fg })),
    ],
    description:
      "Свеча ручной работы из натурального соевого воска. Тёплый аромат амбры и ванили создаёт атмосферу салона дома. Идеально для вечерних ритуалов.",
    highlights: ["40 часов горения", "Веганская формула", "Ручное производство", "Эко-упаковка"],
    specs: [
      { label: "Вес", value: "180 г" },
      { label: "Материал", value: "Соевый воск" },
      { label: "Производство", value: "Россия" },
      { label: "Аромат", value: "Древесный, ванильный" },
    ],
    delivery: {
      free: true,
      days: 5,
      express: false
    },
    suggestions: ["prod-scrub-citrus", "prod-tea-sleep", "prod-oil-warm"],
    related: ["prod-balance-set", "prod-oil-warm", "prod-bath-salt"],
  },
  {
    id: "prod-mask-renewal",
    slug: "mask-renewal",
    title: "Ночная маска Renewal",
    subtitle: "Глубокое восстановление",
    brand: "Skin Lab",
    categoryId: "face-masks",
    tags: ["маска", "увлажнение", "ночной уход"],
    price: 2290,
    currency: "RUB",
    rating: 4.6,
    reviewsCount: 54,
    inStock: true,
    stockLevel: "high",
    thumbnail: dataUri(iconSvg("mask", { fg: THEME.calm.fg })),
    images: [
      dataUri(iconSvg("mask", { fg: THEME.calm.fg })),
      dataUri(iconSvg("mask", { fg: THEME.fresh.fg })),
    ],
    description:
      "Плотная ночная маска с пептидами и гиалуроновой кислотой. Работает пока вы спите, восстанавливая микробиом кожи. Утром - гладкая и увлажненная кожа.",
    highlights: ["Пептидный комплекс", "Подходит для зимы", "Без отдушек", "Быстрое впитывание"],
    specs: [
      { label: "Тип кожи", value: "Сухая, нормальная" },
      { label: "Объём", value: "50 мл" },
      { label: "Применение", value: "Ночное" },
    ],
    delivery: {
      free: false,
      days: 3,
      express: true
    },
    suggestions: ["prod-serum-247", "prod-scrub-citrus", "prod-cream-hydra"],
    related: ["prod-serum-247", "prod-balance-set", "prod-oil-warm"],
  },
  {
    id: "prod-scrub-citrus",
    slug: "scrub-citrus",
    title: "Скраб Citrus Energy",
    subtitle: "Тонизирующий эффект",
    brand: "One Rituals",
    categoryId: "body-scrubs",
    tags: ["скраб", "энергия", "очищение"],
    price: 1650,
    currency: "RUB",
    rating: 4.5,
    reviewsCount: 42,
    inStock: true,
    stockLevel: "medium",
    thumbnail: dataUri(iconSvg("scrub", { acc: THEME.brand.acc })),
    images: [
      dataUri(iconSvg("scrub", { acc: THEME.brand.acc })),
      dataUri(iconSvg("scrub", { acc: THEME.fresh.acc })),
    ],
    description:
      "Крупнозернистый скраб на основе морской соли с эфирными маслами цитрусов. Разогревает и мягко полирует кожу. Идеально для утреннего душа.",
    highlights: ["Кофеин + витамин E", "Убирает микрорельеф", "Подходит для SPA-процедур", "Натуральные абразивы"],
    specs: [
      { label: "Вес", value: "250 г" },
      { label: "Производство", value: "Латвия" },
      { label: "Эффект", value: "Тонизирующий" },
    ],
    delivery: {
      free: true,
      days: 4,
      express: false
    },
    suggestions: ["prod-oil-warm", "prod-candle-amber", "prod-bath-salt"],
    related: ["prod-balance-set", "prod-oil-warm", "prod-candle-amber"],
  },
  {
    id: "prod-gift-card",
    slug: "gift-card-5000",
    title: "Подарочный сертификат 5 000 ₽",
    brand: "OneStack",
    categoryId: "gifts-certificates",
    tags: ["подарок", "сертификат", "универсальный"],
    price: 5000,
    currency: "RUB",
    rating: 5,
    reviewsCount: 18,
    inStock: true,
    stockLevel: "high",
    thumbnail: dataUri(iconSvg("gift", { fg: THEME.warm.acc })),
    images: [
      dataUri(iconSvg("gift", { fg: THEME.warm.acc })),
      dataUri(iconSvg("gift", { fg: THEME.calm.acc })),
    ],
    description:
      "Электронный сертификат на любые услуги и товары OneStack. Доступен сразу после покупки. Идеальный подарок для близких.",
    highlights: ["Действует 12 месяцев", "Отправим на e-mail", "Можно распечатать", "Моментальная доставка"],
    specs: [
      { label: "Формат", value: "Электронный" },
      { label: "Номинал", value: "5 000 ₽" },
      { label: "Срок", value: "12 месяцев" },
    ],
    variants: [
      { id: "3000", label: "3 000 ₽", inStock: true },
      { id: "5000", label: "5 000 ₽", inStock: true },
      { id: "10000", label: "10 000 ₽", inStock: true },
    ],
    delivery: {
      free: true,
      days: 0,
      express: true
    },
    suggestions: ["prod-balance-set", "prod-serum-247", "prod-candle-amber"],
    related: ["prod-balance-set", "prod-mask-renewal", "prod-limited-set"],
  },
  {
    id: "prod-oil-warm",
    slug: "body-oil-warm",
    title: "Массажное масло Warm Up",
    brand: "One Rituals",
    categoryId: "body-oils",
    tags: ["масло", "массаж", "разогрев"],
    price: 2890,
    currency: "RUB",
    rating: 4.4,
    reviewsCount: 21,
    inStock: false,
    stockLevel: "low",
    thumbnail: dataUri(iconSvg("oil", { acc: THEME.warm.acc })),
    images: [
      dataUri(iconSvg("oil", { acc: THEME.warm.acc })),
      dataUri(iconSvg("oil", { acc: THEME.brand.acc })),
    ],
    description:
      "Тёплое массажное масло с имбирём и сандалом. Усиливает эффект массажа и расслабляет мышцы. Идеально для спортивного восстановления.",
    highlights: ["Имбирное масло", "Удобная помпа", "Разогревающий эффект", "Быстрое впитывание"],
    specs: [
      { label: "Объём", value: "120 мл" },
      { label: "Тип", value: "Разогревающее" },
      { label: "Эффект", value: "Расслабляющий" },
    ],
    delivery: {
      free: true,
      days: 7,
      express: false
    },
    suggestions: ["prod-scrub-citrus", "prod-candle-amber", "prod-bath-salt"],
    related: ["prod-balance-set", "prod-scrub-citrus", "prod-candle-amber"],
  },
  {
    id: "prod-tea-sleep",
    slug: "herbal-tea-sleep",
    title: "Травяной чай Sleep Ritual",
    brand: "Calm Leaf",
    categoryId: "rituals-sleep",
    tags: ["сон", "чай", "релакс", "травы"],
    price: 790,
    currency: "RUB",
    rating: 4.8,
    reviewsCount: 35,
    inStock: true,
    stockLevel: "medium",
    thumbnail: dataUri(iconSvg("tea", { fg: THEME.calm.fg })),
    images: [
      dataUri(iconSvg("tea", { fg: THEME.calm.fg })),
      dataUri(iconSvg("tea", { fg: THEME.fresh.fg })),
    ],
    description:
      "Смесь трав для вечернего ритуала. Лаванда, мелисса и ромашка помогают расслабиться и улучшить качество сна. Без кофеина.",
    highlights: ["Без кофеина", "Органические ингредиенты", "Можно заваривать холодным способом", "Успокаивающий эффект"],
    specs: [
      { label: "Вес", value: "80 г" },
      { label: "Упаковка", value: "Жестяная банка" },
      { label: "Количество", value: "15 пакетиков" },
    ],
    delivery: {
      free: false,
      days: 3,
      express: true
    },
    suggestions: ["prod-candle-amber", "prod-balance-set", "prod-oil-warm"],
    related: ["prod-balance-set", "prod-scrub-citrus", "prod-candle-amber"],
  },
  {
    id: "prod-limited-set",
    slug: "limited-winter-set",
    title: "Зимний лимитированный сет",
    subtitle: "Подарочная коробка",
    brand: "One Rituals",
    categoryId: "rituals-aroma",
    tags: ["набор", "подарок", "арома", "лимитированный"],
    price: 4290,
    currency: "RUB",
    rating: 4.9,
    reviewsCount: 12,
    badge: "limited",
    inStock: true,
    stockLevel: "low",
    thumbnail: dataUri(iconSvg("set", { fg: THEME.warm.fg, acc: THEME.warm.acc })),
    images: [
      dataUri(iconSvg("set", { fg: THEME.warm.fg, acc: THEME.warm.acc })),
    ],
    description:
      "Коллекционный набор для зимних вечеров: мини-свеча, масло для тела и чай с пряностями в подарочной упаковке. Только в этом сезоне!",
    highlights: ["Лимитированная серия", "Подарочная коробка", "Идеально для вечеров", "Эксклюзивный дизайн"],
    specs: [
      { label: "Сезон", value: "Зима" },
      { label: "Состав", value: "Свеча, масло, чай" },
      { label: "Тираж", value: "500 шт" },
    ],
    delivery: {
      free: true,
      days: 2,
      express: true
    },
    suggestions: ["prod-tea-sleep", "prod-candle-amber", "prod-gift-card"],
    related: ["prod-balance-set", "prod-candle-amber", "prod-gift-card"],
  },
  {
    id: "prod-bath-salt",
    slug: "bath-salt-relax",
    title: "Соль для ванны Deep Relax",
    brand: "One Rituals",
    categoryId: "body-bath",
    tags: ["соль", "ванна", "релакс", "детокс"],
    price: 1250,
    currency: "RUB",
    rating: 4.7,
    reviewsCount: 28,
    inStock: true,
    stockLevel: "high",
    thumbnail: dataUri(iconSvg("bath", { fg: THEME.fresh.fg })),
    images: [
      dataUri(iconSvg("bath", { fg: THEME.fresh.fg })),
      dataUri(iconSvg("bath", { fg: THEME.calm.fg })),
    ],
    description:
      "Морская соль с эфирными маслами лаванды и ромашки для расслабляющей ванны. Снимает напряжение и успокаивает кожу.",
    highlights: ["Морская соль", "Эфирные масла", "Расслабляющий эффект", "Подходит для чувствительной кожи"],
    specs: [
      { label: "Вес", value: "500 г" },
      { label: "Эффект", value: "Расслабляющий" },
      { label: "Аромат", value: "Цветочный" },
    ],
    delivery: {
      free: true,
      days: 4,
      express: false
    },
    suggestions: ["prod-candle-amber", "prod-oil-warm", "prod-tea-sleep"],
    related: ["prod-balance-set", "prod-scrub-citrus", "prod-oil-warm"],
  },
  {
    id: "prod-cream-hydra",
    slug: "cream-hydra",
    title: "Увлажняющий крем Hydra Boost",
    brand: "Skin Lab",
    categoryId: "face-creams",
    tags: ["крем", "увлажнение", "ежедневный уход"],
    price: 2750,
    currency: "RUB",
    rating: 4.6,
    reviewsCount: 47,
    inStock: true,
    stockLevel: "medium",
    thumbnail: dataUri(iconSvg("cream", { fg: THEME.brand.fg })),
    images: [
      dataUri(iconSvg("cream", { fg: THEME.brand.fg })),
      dataUri(iconSvg("cream", { fg: THEME.fresh.fg })),
    ],
    description:
      "Лёгкий увлажняющий крем с гиалуроновой кислотой для ежедневного использования. Подходит для всех типов кожи, включая чувствительную.",
    highlights: ["Гиалуроновая кислота", "Без отдушек", "Быстрое впитывание", "Не оставляет плёнки"],
    specs: [
      { label: "Тип кожи", value: "Все типы" },
      { label: "Объём", value: "50 мл" },
      { label: "Текстура", value: "Лёгкая" },
    ],
    delivery: {
      free: false,
      days: 2,
      express: true
    },
    suggestions: ["prod-serum-247", "prod-mask-renewal", "prod-perfume-essence"],
    related: ["prod-serum-247", "prod-mask-renewal", "prod-balance-set"],
  },
  {
    id: "prod-perfume-essence",
    slug: "perfume-essence",
    title: "Туалетная вода Essence",
    subtitle: "Унисекс аромат",
    brand: "One Rituals",
    categoryId: "body-perfume",
    tags: ["парфюм", "унисекс", "аромат", "аксессуар"],
    price: 3890,
    currency: "RUB",
    rating: 4.5,
    reviewsCount: 33,
    badge: "new",
    inStock: true,
    stockLevel: "medium",
    thumbnail: dataUri(iconSvg("perfume", { fg: THEME.calm.fg })),
    images: [
      dataUri(iconSvg("perfume", { fg: THEME.calm.fg })),
      dataUri(iconSvg("perfume", { fg: THEME.brand.fg })),
    ],
    description:
      "Унисекс аромат с нотами бергамота, мускуса и амбры. Стойкий и элегантный, подходит для любого времени суток.",
    highlights: ["Унисекс", "Стойкость 8 часов", "Флакон из переработанного стекла", "Французская парфюмерия"],
    specs: [
      { label: "Объём", value: "50 мл" },
      { label: "Тип", value: "Туалетная вода" },
      { label: "Стойкость", value: "8 часов" },
    ],
    variants: [
      { id: "50ml", label: "50 мл", inStock: true },
      { id: "100ml", label: "100 мл", priceModifier: 1500, inStock: true },
    ],
    delivery: {
      free: true,
      days: 3,
      express: true
    },
    suggestions: ["prod-gift-card", "prod-balance-set", "prod-candle-amber"],
    related: ["prod-balance-set", "prod-gift-card", "prod-candle-amber"],
  },
] as const;

/* ------------------------------ Derived meta ------------------------------ */

function deriveShopMeta(list: readonly ShopProduct[]) {
  const brands = Array.from(new Set(list.map((p) => p.brand))).sort((a, b) => a.localeCompare(b, "ru"));
  const tags = Array.from(new Set(list.flatMap((p) => p.tags))).sort((a, b) => a.localeCompare(b, "ru"));
  const prices = list.map((p) => p.price);
  const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
  
  const totalProducts = list.length;
  const totalBrands = brands.length;
  const totalCategories = new Set(list.map(p => p.categoryId)).size;
  const averageRating = list.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
  
  return { 
    brands, 
    tags, 
    priceRange,
    stats: {
      totalProducts,
      totalBrands,
      totalCategories,
      averageRating: Number(averageRating.toFixed(1))
    }
  };
}

/** В дев-режиме подсветит отсутствующие связи в suggestions/related */
function validateRelations(list: readonly ShopProduct[]) {
  if (process.env.NODE_ENV === "production") return;
  const ids = new Set(list.map((p) => p.id));
  list.forEach((p) => {
    [...p.suggestions, ...p.related].forEach((rel) => {
      if (!ids.has(rel)) {
        // eslint-disable-next-line no-console
        console.warn(`mockUserShop: missing related id "${rel}" for product "${p.id}"`);
      }
    });
  });
}

const { brands, tags, priceRange, stats } = deriveShopMeta(products);
validateRelations(products);

/* -------------------------------- Reviews -------------------------------- */

const reviews: Record<string, ProductReview[]> = {
  "prod-balance-set": [
    { 
      id: "rev-1", 
      author: "Мария",  
      rating: 5, 
      createdAt: "2024-09-12", 
      text: "Собранный ритуал, всё подписано и очень красиво упаковано. Клиентам показываю как пример.",
      verified: true
    },
    { 
      id: "rev-2", 
      author: "Ирина",  
      rating: 4, 
      createdAt: "2024-08-03", 
      text: "Люблю брать на подарки. Хотелось бы больше выбора ароматов свечей.",
      verified: true
    },
  ],
  "prod-serum-247": [
    { 
      id: "rev-3", 
      author: "Алина",  
      rating: 5, 
      createdAt: "2024-10-01", 
      text: "После месяца использования кожа заметно светлее и меньше постакне.",
      verified: true
    },
    { 
      id: "rev-4", 
      author: "Татьяна",
      rating: 4, 
      createdAt: "2024-09-18", 
      text: "Отличная текстура, быстро впитывается. Запах еле уловимый.",
      verified: false
    },
  ],
  "prod-candle-amber": [
    { 
      id: "rev-5", 
      author: "Дмитрий",  
      rating: 5, 
      createdAt: "2024-10-15", 
      text: "Аромат просто волшебный! Горят равномерно, упаковка стильная.",
      verified: true
    },
  ],
};

/* -------------------------- Indices & utilities -------------------------- */

// Быстрые индексы
export const byId: Record<string, ShopProduct> = Object.fromEntries(products.map(p => [p.id, p as ShopProduct]));
export const bySlug: Record<string, ShopProduct> = Object.fromEntries(products.map(p => [p.slug, p as ShopProduct]));

// Человекочитаемая цена
export const formatPrice = (value: number, currency: "RUB" = "RUB") =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(value);

// Цена с учётом варианта
export const getVariantPrice = (p: ShopProduct, variantId?: string) => {
  const mod = p.variants?.find(v => v.id === variantId)?.priceModifier ?? 0;
  return p.price + mod;
};

// Сортировки
const sorters: Record<SortKey, (a: ShopProduct, b: ShopProduct) => number> = {
  popular:     (a, b) => b.reviewsCount - a.reviewsCount || b.rating - a.rating,
  price_asc:   (a, b) => a.price - b.price,
  price_desc:  (a, b) => b.price - a.price,
  new:         (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.rating - a.rating,
  rating_desc: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
};

export function applySort(list: ShopProduct[], by: SortKey = "popular") {
  const arr = list.slice();
  arr.sort(sorters[by] ?? sorters.popular);
  return arr;
}

export type FilterInput = {
  q?: string;
  brands?: string[];
  tags?: string[];
  inStock?: boolean;
  priceMin?: number;
  priceMax?: number;
  categoryId?: string;
  featured?: boolean;
};

// Нечувствительный к регистру поиск по title/subtitle/brand/tags
export function filterProducts(list: ShopProduct[], f: FilterInput = {}) {
  const q = f.q?.trim().toLowerCase();
  const brandSet = f.brands?.length ? new Set(f.brands) : null;
  const tagSet = f.tags?.length ? new Set(f.tags) : null;

  return list.filter((p) => {
    if (f.featured && !p.featured) return false;
    if (f.inStock && !p.inStock) return false;
    if (f.priceMin != null && p.price < f.priceMin) return false;
    if (f.priceMax != null && p.price > f.priceMax) return false;
    if (f.categoryId && p.categoryId !== f.categoryId) return false;
    if (brandSet && !brandSet.has(p.brand)) return false;
    if (tagSet && !p.tags.some((t) => tagSet.has(t))) return false;
    if (q) {
      const hay = `${p.title} ${p.subtitle ?? ""} ${p.brand} ${p.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// Получить рекомендуемые товары
export function getFeaturedProducts(list: ShopProduct[], limit: number = 6) {
  return list
    .filter(p => p.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// Получить новинки
export function getNewProducts(list: ShopProduct[], limit: number = 6) {
  return list
    .filter(p => p.isNew)
    .sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
    .slice(0, limit);
}

/* ---------------------------- JSON-LD helpers ---------------------------- */

// Для списка (ItemList)
export function toItemListLD(items: ShopProduct[], baseUrl = "https://onestack24.ru") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${baseUrl}/demo/user/shop/product/${p.slug}`,
      name: p.title,
    })),
  };
}

// Для карточки товара (Product + Offer)
export function toProductLD(p: ShopProduct, baseUrl = "https://onestack24.ru") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    brand: p.brand,
    image: [p.thumbnail, ...p.images],
    sku: p.id,
    url: `${baseUrl}/demo/user/shop/product/${p.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating.toFixed(1),
      reviewCount: p.reviewsCount,
    },
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: p.currency,
      availability: p.inStock ? "http://schema.org/InStock" : "http://schema.org/OutOfStock",
      url: `${baseUrl}/demo/user/shop/product/${p.slug}`,
    },
  };
}

/* -------------------------------- Export -------------------------------- */

export const mockUserShop: ShopData = {
  products: products as unknown as ShopProduct[],
  brands,
  tags,
  priceRange,
  reviews,
  stats,
};