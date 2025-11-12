// src/app/demo/data/products.ts

export type Product = {
  id: string;
  title: string;
  price: number; // currency units (minorless)
  sku?: string;
  category?: Category;
  desc?: string;
  images?: string[];
};

/* -------------------------------- Lists -------------------------------- */

export const CATEGORY_LIST = [
  "Пакеты",
  "Модули",
  "Шампуни",
  "Бальзамы",
  "Маски",
  "Укладка",
] as const;
export type Category = typeof CATEGORY_LIST[number];

export const BRAND_LIST = ["CRM", "MOD", "BEAUTY", "CARE", "PRO", "DEV"] as const;
export type Brand = typeof BRAND_LIST[number];

/* ------------------------------ Images --------------------------------- */

const IMG_POOL = [
  "/demo/products/p-1001-1.jpg",
  "/demo/products/p-1001-2.jpg",
  "/demo/products/p-1002-1.jpg",
  "/demo/products/p-1002-2.jpg",
  "/demo/products/p-1003-1.jpg",
  "/demo/products/p-1003-2.jpg",
  "/demo/products/p-1004-1.jpg",
  "/demo/products/p-1004-2.jpg",
  "/demo/products/p-1005-1.jpg",
  "/demo/products/p-1005-2.jpg",
  "/demo/products/p-1006-1.jpg",
  "/demo/products/p-1006-2.jpg",
];

const IMGS_SHAMPOO = Array.from({ length: 10 }, (_, i) => `/demo/products/shampoo-${i + 1}.jpg`);
const IMGS_CONDITIONER = Array.from({ length: 10 }, (_, i) => `/demo/products/conditioner-${i + 1}.jpg`);
const IMGS_MASK = Array.from({ length: 10 }, (_, i) => `/demo/products/mask-${i + 1}.jpg`);
const IMGS_STYLING = Array.from({ length: 10 }, (_, i) => `/demo/products/styling-${i + 1}.jpg`);

const IMG_BY_CAT: Record<Category, string[]> = {
  Пакеты: IMG_POOL,
  Модули: IMG_POOL,
  Шампуни: IMGS_SHAMPOO,
  Бальзамы: IMGS_CONDITIONER,
  Маски: IMGS_MASK,
  Укладка: IMGS_STYLING,
};

/* ------------------------------ Utilities ------------------------------ */

// Мягкий транслит → ASCII-safe slug для SKU/URL
const translitTable: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh",
  щ: "shch", ь: "", ы: "y", ъ: "", э: "e", ю: "yu", я: "ya",
};
function slugifyRu(input: string) {
  return input
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => translitTable[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const brandOf = (p: Product): string => (p.sku?.split("-")[0] || "GEN").toUpperCase();

// Детерминированная «псевдо-рандомная» цена в коридоре
const priceFrom = (seed: number, min = 290, max = 4490, step = 10) => {
  const span = Math.floor((max - min) / step);
  const idx = (seed * 16807) % (span + 1);
  return min + idx * step;
};

// Локальный генератор id (без глобальных переменных)
const makeIdGen = (start = 2001) => {
  let s = start;
  return () => `p-${s++}`;
};
const nextId = makeIdGen();

/* ------------------------------ Base items ----------------------------- */

const BASE_PRODUCTS: Product[] = [
  {
    id: "p-1001",
    title: "CRM Лицензия — Старт",
    price: 990,
    sku: "CRM-START",
    category: "Пакеты",
    desc: "Базовый пакет для старта: контакты, сделки, задачи.",
    images: ["/demo/products/p-1001-1.jpg", "/demo/products/p-1001-2.jpg", "/demo/products/p-1001-3.jpg"],
  },
  {
    id: "p-1002",
    title: "CRM Лицензия — Бизнес",
    price: 2490,
    sku: "CRM-BIZ",
    category: "Пакеты",
    desc: "Расширенный пакет: роли, отчёты, интеграции.",
    images: ["/demo/products/p-1002-1.jpg", "/demo/products/p-1002-2.jpg", "/demo/products/p-1002-3.jpg"],
  },
  {
    id: "p-1003",
    title: "Онлайн-оплата модуль",
    price: 590,
    sku: "MOD-PAY",
    category: "Модули",
    desc: "Stripe/YooKassa/CloudPayments, квитанции и возвраты.",
    images: ["/demo/products/p-1003-1.jpg", "/demo/products/p-1003-2.jpg", "/demo/products/p-1003-3.jpg"],
  },
  {
    id: "p-1004",
    title: "Бронирование модуль",
    price: 790,
    sku: "MOD-BOOK",
    category: "Модули",
    desc: "Календарь, ресурсы, расписание и подтверждение.",
    images: ["/demo/products/p-1004-1.jpg", "/demo/products/p-1004-2.jpg", "/demo/products/p-1004-3.jpg"],
  },
  {
    id: "p-1005",
    title: "Аналитика отчёты",
    price: 450,
    sku: "MOD-ANALYTICS",
    category: "Модули",
    desc: "Отчёты по выручке, каналам и воронкам.",
    images: ["/demo/products/p-1005-1.jpg", "/demo/products/p-1005-2.jpg", "/demo/products/p-1005-3.jpg"],
  },
  {
    id: "p-1006",
    title: "Интеграции + API",
    price: 1190,
    sku: "MOD-API",
    category: "Модули",
    desc: "REST/GraphQL, вебхуки, ERP/биллинг, очереди.",
    images: ["/demo/products/p-1006-1.jpg", "/demo/products/p-1006-2.jpg", "/demo/products/p-1006-3.jpg"],
  },
];

/* --------------------------- Name dictionaries ------------------------- */

const NAMES: Record<Category, string[]> = {
  Пакеты: ["Лицензия Старт", "Лицензия Бизнес", "Лицензия Pro", "Расширенный"],
  Модули: ["Оплаты", "Бронирование", "Аналитика", "API"],
  Шампуни: [
    "Увлажняющий", "Для окрашенных", "Объём и блеск", "Восстановление",
    "Нежный ежедневный", "Против перхоти", "Сияние цвета", "Глубокая очистка",
  ],
  Бальзамы: [
    "Питательный", "Лёгкий блеск", "С кератином", "Смягчающий",
    "Гладкость и защита", "Восстанавливающий", "Для тонких волос", "Глубокое увлажнение",
  ],
  Маски: [
    "Экспресс-восстановление", "Питание и сила", "С маслом арганы", "Укрепляющая",
    "Блеск и эластичность", "Ночной уход", "Реконструктор", "SPA-маска",
  ],
  Укладка: [
    "Спрей для объёма", "Гель сильной фиксации", "Мусс лёгкий", "Воск текстурирующий",
    "Лак гибкой фиксации", "Крем термозащита", "Паста матовая", "Соль для объёма",
  ],
};

/* ------------------------------ Builders ------------------------------- */

function makeProduct(params: {
  brand: Brand;
  cat: Category;
  idx: number;
  seed: number;
}): Product {
  const { brand, cat, idx, seed } = params;
  const id = nextId();
  const names = NAMES[cat] ?? [cat];
  const name = names[idx % names.length];

  const title =
    cat === "Шампуни" || cat === "Бальзамы" || cat === "Маски" || cat === "Укладка"
      ? `${name} (${brand})`
      : `${cat} — ${name} (${brand})`;

  const sku = `${brand}-${slugifyRu(cat)}-${100 + idx}`.toUpperCase();
  const price = priceFrom(seed);

  const imgs = IMG_BY_CAT[cat] ?? IMG_POOL;
  const img = imgs[idx % imgs.length];

  return {
    id,
    title,
    price,
    sku,
    category: cat,
    desc: `Демо-товар категории «${cat}», бренд ${brand}. Подходит для демонстрации каталога и фильтров.`,
    images: [img],
  };
}

// Создаём генеративный набор: по 8 товаров на категорию
function generateByCategory(): Product[] {
  const out: Product[] = [];
  CATEGORY_LIST.forEach((cat, ci) => {
    for (let i = 0; i < 8; i++) {
      const brand = BRAND_LIST[(i + ci) as number % BRAND_LIST.length];
      out.push(makeProduct({ brand, cat, idx: i, seed: (ci + 1) * 1000 + i * 37 }));
    }
  });
  return out;
}

// Добиваем бренды до максимального количества (визуально ровные ленты)
function topUpByBrand(products: Product[]): Product[] {
  const counts: Record<string, number> = {};
  products.forEach((p) => {
    const b = brandOf(p);
    counts[b] = (counts[b] || 0) + 1;
  });
  const target = Math.max(...BRAND_LIST.map((b) => counts[b] || 0));

  const additions: Product[] = [];
  BRAND_LIST.forEach((brand, bi) => {
    const cur = counts[brand] || 0;
    const need = target - cur;
    for (let k = 0; k < need; k++) {
      // Размазываем добивку по «косметическим» — они визуально разнообразнее
      const beautyCats: Category[] = ["Шампуни", "Бальзамы", "Маски", "Укладка"];
      const cat = beautyCats[(bi + k) % beautyCats.length];
      additions.push(
        makeProduct({
          brand,
          cat,
          idx: 500 + k, // чтобы SKU не пересекался
          seed: 9000 + bi * 100 + k,
        })
      );
    }
  });
  return additions;
}

/* --------------------------------- Build -------------------------------- */

const GENERATED = generateByCategory();
const TOPUP = topUpByBrand([...BASE_PRODUCTS, ...GENERATED]);

export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...GENERATED, ...TOPUP];

/* -------------------------- Optional helpers --------------------------- */

// Удобно для витрины/фильтров
export const ALL_BRANDS: Brand[] = [...BRAND_LIST];
export const ALL_CATEGORIES: Category[] = [...CATEGORY_LIST];