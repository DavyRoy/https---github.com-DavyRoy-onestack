// src/app/demo/user/shop/data/mockUserShopCategories.ts

export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  children?: ShopCategory[];
  /** Небольшой токен для иконки в UI (совместим с иконками товаров) */
  icon?: "set" | "serum" | "candle" | "mask" | "scrub" | "gift" | "oil" | "tea" | "bath" | "cream" | "perfume" | "accessory";
  /** Дополнительные метаданные для UI */
  meta?: {
    isNew?: boolean;
    featured?: boolean;
    productCount?: number;
    color?: string;
    gradient?: string;
  };
};

/** Иерархия категорий магазина (top-level) */
export const shopCategories: ShopCategory[] = [
  {
    id: "rituals",
    name: "SPA-ритуалы",
    slug: "spa-rituals",
    description: "Готовые наборы и ритуалы для домашнего ухода. Полное погружение в атмосферу спа-салона.",
    icon: "set",
    meta: {
      featured: true,
      productCount: 24,
      gradient: "from-blue-500/20 to-purple-500/20"
    },
    children: [
      { 
        id: "rituals-aroma", 
        name: "Арома-наборы", 
        slug: "aroma-sets", 
        icon: "candle",
        meta: {
          productCount: 12,
          color: "text-blue-300"
        }
      },
      { 
        id: "rituals-detox", 
        name: "Детокс", 
        slug: "detox", 
        icon: "scrub",
        meta: {
          productCount: 8,
          color: "text-green-300"
        }
      },
      { 
        id: "rituals-sleep", 
        name: "Сон и расслабление", 
        slug: "sleep", 
        icon: "tea",
        meta: {
          productCount: 4,
          color: "text-purple-300"
        }
      },
      { 
        id: "rituals-bath", 
        name: "Ванные ритуалы", 
        slug: "bath", 
        icon: "bath",
        meta: {
          isNew: true,
          productCount: 6,
          color: "text-cyan-300"
        }
      },
    ],
  },
  {
    id: "face",
    name: "Уход за лицом",
    slug: "face-care",
    description: "Профессиональная косметика для лица: сыворотки, кремы и маски премиум-класса",
    icon: "mask",
    meta: {
      productCount: 42,
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    children: [
      { 
        id: "face-serums", 
        name: "Сыворотки", 
        slug: "serums", 
        icon: "serum",
        meta: {
          productCount: 15,
          color: "text-pink-300"
        }
      },
      { 
        id: "face-masks", 
        name: "Маски", 
        slug: "masks", 
        icon: "mask",
        meta: {
          productCount: 12,
          color: "text-rose-300"
        }
      },
      { 
        id: "face-creams", 
        name: "Кремы", 
        slug: "creams", 
        icon: "cream",
        meta: {
          productCount: 10,
          color: "text-amber-300"
        }
      },
      { 
        id: "face-toners", 
        name: "Тоники", 
        slug: "toners", 
        icon: "serum",
        meta: {
          productCount: 5,
          color: "text-lime-300"
        }
      },
    ],
  },
  {
    id: "body",
    name: "Уход за телом",
    slug: "body-care",
    description: "Премиальные средства для ухода за телом: от скрабов до массажных масел",
    icon: "oil",
    meta: {
      productCount: 36,
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    children: [
      { 
        id: "body-scrubs", 
        name: "Скрабы", 
        slug: "scrubs", 
        icon: "scrub",
        meta: {
          productCount: 8,
          color: "text-green-300"
        }
      },
      { 
        id: "body-candles", 
        name: "Свечи", 
        slug: "candles", 
        icon: "candle",
        meta: {
          productCount: 12,
          color: "text-amber-300"
        }
      },
      { 
        id: "body-oils", 
        name: "Масла", 
        slug: "oils", 
        icon: "oil",
        meta: {
          productCount: 10,
          color: "text-emerald-300"
        }
      },
      { 
        id: "body-lotions", 
        name: "Лосьоны", 
        slug: "lotions", 
        icon: "cream",
        meta: {
          productCount: 6,
          color: "text-teal-300"
        }
      },
    ],
  },
  {
    id: "gifts",
    name: "Подарки",
    slug: "gifts",
    description: "Эксклюзивные подарочные наборы и сертификаты для особых случаев",
    icon: "gift",
    meta: {
      featured: true,
      productCount: 18,
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    children: [
      { 
        id: "gifts-certificates", 
        name: "Сертификаты", 
        slug: "certificates", 
        icon: "gift",
        meta: {
          productCount: 3,
          color: "text-amber-300"
        }
      },
      { 
        id: "gifts-sets", 
        name: "Подарочные наборы", 
        slug: "gift-sets", 
        icon: "set",
        meta: {
          productCount: 12,
          color: "text-orange-300"
        }
      },
      { 
        id: "gifts-premium", 
        name: "Премиум-боксы", 
        slug: "premium-boxes", 
        icon: "gift",
        meta: {
          isNew: true,
          productCount: 3,
          color: "text-red-300"
        }
      },
    ],
  },
  {
    id: "accessories",
    name: "Аксессуары",
    slug: "accessories",
    description: "Эстетичные аксессуары для полного погружения в ритуалы ухода",
    icon: "accessory",
    meta: {
      productCount: 15,
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    children: [
      { 
        id: "accessories-diffusers", 
        name: "Диффузоры", 
        slug: "diffusers", 
        icon: "candle",
        meta: {
          productCount: 5,
          color: "text-purple-300"
        }
      },
      { 
        id: "accessories-tools", 
        name: "Инструменты", 
        slug: "tools", 
        icon: "accessory",
        meta: {
          productCount: 7,
          color: "text-indigo-300"
        }
      },
      { 
        id: "accessories-storage", 
        name: "Хранение", 
        slug: "storage", 
        icon: "set",
        meta: {
          productCount: 3,
          color: "text-violet-300"
        }
      },
    ],
  },
  {
    id: "perfume",
    name: "Парфюмерия",
    slug: "perfume",
    description: "Утонченные ароматы для создания индивидуального стиля",
    icon: "perfume",
    meta: {
      isNew: true,
      productCount: 8,
      gradient: "from-rose-500/20 to-pink-500/20"
    },
    children: [
      { 
        id: "perfume-signature", 
        name: "Сигнатурные ароматы", 
        slug: "signature", 
        icon: "perfume",
        meta: {
          productCount: 4,
          color: "text-rose-300"
        }
      },
      { 
        id: "perfume-seasonal", 
        name: "Сезонные коллекции", 
        slug: "seasonal", 
        icon: "perfume",
        meta: {
          productCount: 4,
          color: "text-pink-300"
        }
      },
    ],
  },
  {
    id: "new",
    name: "Новинки",
    slug: "new",
    description: "Самые свежие поступления и эксклюзивные новинки сезона",
    icon: "set",
    meta: {
      isNew: true,
      productCount: 12,
      gradient: "from-cyan-500/20 to-blue-500/20"
    },
  },
  {
    id: "sale",
    name: "Распродажа",
    slug: "sale",
    description: "Специальные предложения и товары со скидкой",
    icon: "gift",
    meta: {
      productCount: 8,
      gradient: "from-red-500/20 to-orange-500/20"
    },
  },
] as const;

/* --------------------------------- Helpers --------------------------------- */

/** Плоский список всех категорий (включая дочерние) */
export const ALL_CATEGORIES_FLAT: ShopCategory[] = (() => {
  const out: ShopCategory[] = [];
  const walk = (nodes: readonly ShopCategory[]) => {
    for (const node of nodes) {
      out.push(node as ShopCategory);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(shopCategories as unknown as ShopCategory[]);
  return out;
})();

/** Карта id → категория */
export const CATEGORY_BY_ID: Record<string, ShopCategory> = ALL_CATEGORIES_FLAT.reduce(
  (acc, c) => ((acc[c.id] = c), acc),
  {} as Record<string, ShopCategory>
);

/** Карта slug → категория (для маршрутизации по slug) */
export const CATEGORY_BY_SLUG: Record<string, ShopCategory> = ALL_CATEGORIES_FLAT.reduce(
  (acc, c) => ((acc[c.slug] = c), acc),
  {} as Record<string, ShopCategory>
);

/** Карта id → parentId (undefined для корня) */
export const PARENT_BY_ID: Record<string, string | undefined> = (() => {
  const map: Record<string, string | undefined> = {};
  const dfs = (nodes: readonly ShopCategory[], parentId?: string) => {
    for (const n of nodes) {
      map[n.id] = parentId;
      if (n.children?.length) dfs(n.children, n.id);
    }
  };
  dfs(shopCategories as unknown as ShopCategory[], undefined);
  return map;
})();

/** Карта id → rootId верхнего уровня */
export const ROOT_BY_ID: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  const fill = (nodes: readonly ShopCategory[], rootId: string) => {
    for (const n of nodes) {
      map[n.id] = rootId;
      if (n.children?.length) fill(n.children, rootId);
    }
  };
  for (const root of shopCategories) {
    map[root.id] = root.id;
    if (root.children?.length) fill(root.children, root.id);
  }
  return map;
})();

/**
 * Индекс верхнего уровня → массив разрешённых id (собственный + все дочерние)
 * Пример: CATEGORY_INDEX["rituals"] → ["rituals", "rituals-aroma", "rituals-detox", "rituals-sleep"]
 */
export const CATEGORY_INDEX: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  const collect = (node: ShopCategory, acc: string[]) => {
    acc.push(node.id);
    node.children?.forEach((ch) => collect(ch, acc));
  };
  for (const root of shopCategories) {
    const ids: string[] = [];
    collect(root as ShopCategory, ids);
    map[root.id] = ids;
  }
  return map;
})();

/** Получить все корневые категории */
export function getRootCategories(): ShopCategory[] {
  return shopCategories as unknown as ShopCategory[];
}

/** Получить featured категории */
export function getFeaturedCategories(): ShopCategory[] {
  return shopCategories.filter(cat => cat.meta?.featured) as ShopCategory[];
}

/** Получить новые категории */
export function getNewCategories(): ShopCategory[] {
  return shopCategories.filter(cat => cat.meta?.isNew) as ShopCategory[];
}

/** Получить общее количество продуктов в категории (включая подкатегории) */
export function getTotalProductCount(categoryId: string): number {
  const category = CATEGORY_BY_ID[categoryId];
  if (!category) return 0;
  
  let total = category.meta?.productCount || 0;
  if (category.children) {
    category.children.forEach(child => {
      total += getTotalProductCount(child.id);
    });
  }
  return total;
}

/** Возвращает путь до категории (от корня), если существует */
export function getCategoryPathById(id: string): ShopCategory[] | null {
  const path: ShopCategory[] = [];
  let found = false;

  const dfs = (nodes: readonly ShopCategory[], trail: ShopCategory[]) => {
    for (const n of nodes) {
      const nextTrail = [...trail, n as ShopCategory];
      if (n.id === id) {
        path.push(...nextTrail);
        found = true;
        return true;
      }
      if (n.children?.length && dfs(n.children, nextTrail)) return true;
    }
    return false;
  };

  dfs(shopCategories as unknown as ShopCategory[], []);
  return found ? path : null;
}

/** Хлебные крошки по id (корень → ... → узел), либо [] если нет */
export function getBreadcrumbs(id: string): ShopCategory[] {
  return getCategoryPathById(id) ?? [];
}

/** Хлебные крошки по slug */
export function getBreadcrumbsBySlug(slug: string): ShopCategory[] {
  const node = CATEGORY_BY_SLUG[slug];
  return node ? getBreadcrumbs(node.id) : [];
}

/** Проверка: является ли категория листом (нет children) */
export function isLeafCategory(id: string): boolean {
  const node = CATEGORY_BY_ID[id];
  return Boolean(node && (!node.children || node.children.length === 0));
}

/** Дочерние элементы (или пустой массив) */
export function getChildrenOf(id: string): ShopCategory[] {
  const node = CATEGORY_BY_ID[id];
  return node?.children ?? [];
}

/** Является ли категория корневой */
export function isRootCategory(id: string): boolean {
  return PARENT_BY_ID[id] === undefined;
}

/** Вернуть rootId для любой категории (или undefined) */
export function getRootIdOf(id: string): string | undefined {
  return ROOT_BY_ID[id];
}

/** Развернуть набор id так, чтобы включить все дочерние (удобно для фильтрации по корню) */
export function expandCategoryIds(ids: string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    const rootIds = CATEGORY_INDEX[id];
    if (rootIds) {
      rootIds.forEach((x) => out.add(x));
    } else {
      out.add(id);
    }
  }
  return Array.from(out);
}

/** Проверка принадлежности категории конкретному корню */
export function belongsToRoot(id: string, rootId: string): boolean {
  return ROOT_BY_ID[id] === rootId;
}

/** Готовые элементы для UI-хлебных крошек (с href под query-параметр) */
export function buildShopBreadcrumbHrefs(id: string) {
  return (getBreadcrumbs(id) ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    href: `/demo/user/shop?category=${c.id}`,
    icon: c.icon,
    meta: c.meta
  }));
}

/** Получить иконку для категории с fallback */
export function getCategoryIcon(categoryId: string): string {
  const category = CATEGORY_BY_ID[categoryId];
  return category?.icon || 'set';
}

/** Получить цвет для категории */
export function getCategoryColor(categoryId: string): string {
  const category = CATEGORY_BY_ID[categoryId];
  return category?.meta?.color || 'text-white/70';
}

/** Получить градиент для категории */
export function getCategoryGradient(categoryId: string): string {
  const category = CATEGORY_BY_ID[categoryId];
  return category?.meta?.gradient || 'from-white/10 to-white/5';
}

/** Поиск категорий по названию */
export function searchCategories(query: string): ShopCategory[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];
  
  return ALL_CATEGORIES_FLAT.filter(category => 
    category.name.toLowerCase().includes(searchTerm) ||
    category.description?.toLowerCase().includes(searchTerm) ||
    category.slug.toLowerCase().includes(searchTerm)
  );
}

/** Получить все листовые категории (без детей) */
export function getAllLeafCategories(): ShopCategory[] {
  return ALL_CATEGORIES_FLAT.filter(category => 
    !category.children || category.children.length === 0
  );
}

/** Получить популярные категории (по количеству продуктов) */
export function getPopularCategories(limit: number = 6): ShopCategory[] {
  return ALL_CATEGORIES_FLAT
    .filter(cat => cat.meta?.productCount && cat.meta.productCount > 0)
    .sort((a, b) => (b.meta?.productCount || 0) - (a.meta?.productCount || 0))
    .slice(0, limit);
}

/* -------------------------- Dev-time validation -------------------------- */

(function devValidate() {
  if (process.env.NODE_ENV === "production") return;

  // дубликаты id/slug
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const c of ALL_CATEGORIES_FLAT) {
    if (ids.has(c.id)) console.warn(`[shopCategories] duplicate id: ${c.id}`);
    ids.add(c.id);
    if (slugs.has(c.slug)) console.warn(`[shopCategories] duplicate slug: ${c.slug}`);
    slugs.add(c.slug);
  }

  // parent/child консистентность
  for (const c of ALL_CATEGORIES_FLAT) {
    const parent = PARENT_BY_ID[c.id];
    if (!parent) continue;
    const parentNode = CATEGORY_BY_ID[parent];
    const ok = parentNode?.children?.some((x) => x.id === c.id);
    if (!ok) console.warn(`[shopCategories] ${c.id} not listed under its parent ${parent}`);
  }

  // проверка метаданных
  for (const c of ALL_CATEGORIES_FLAT) {
    if (c.meta?.productCount && c.meta.productCount < 0) {
      console.warn(`[shopCategories] invalid productCount for ${c.id}: ${c.meta.productCount}`);
    }
  }
})();

/* ---------------------------- Статистика магазина ---------------------------- */

export const shopStats = {
  totalCategories: ALL_CATEGORIES_FLAT.length,
  totalRootCategories: shopCategories.length,
  totalLeafCategories: getAllLeafCategories().length,
  featuredCategories: getFeaturedCategories().length,
  newCategories: getNewCategories().length,
  totalProducts: ALL_CATEGORIES_FLAT.reduce((sum, cat) => sum + (cat.meta?.productCount || 0), 0),
  averageProductsPerCategory: Math.round(
    ALL_CATEGORIES_FLAT.reduce((sum, cat) => sum + (cat.meta?.productCount || 0), 0) / 
    Math.max(ALL_CATEGORIES_FLAT.length, 1)
  ),
};

/* ---------------------------- Экспорт для UI ---------------------------- */

export {
  shopCategories as default
};