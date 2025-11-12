// app/demo/admin/shop/data/mockAdminCategories.ts

export type AdminCategory = {
  id: string;
  name: string;
  parentId?: string | null;
  slug: string;
  aliases?: string[];
  productCount?: number;
};

export const CATEGORIES: AdminCategory[] = [
  // 🧴 Волосы
  { id: "cat-hair", name: "Волосы", slug: "hair", productCount: 28 },
  { id: "cat-hair-care", name: "Уход за волосами", parentId: "cat-hair", slug: "hair-care", productCount: 14 },
  { id: "cat-hair-color", name: "Окрашивание", parentId: "cat-hair", slug: "hair-color", productCount: 8 },
  { id: "cat-hair-styling", name: "Укладка", parentId: "cat-hair", slug: "hair-styling", productCount: 6 },

  // 💅 Ногти
  { id: "cat-nails", name: "Ногти", slug: "nails", productCount: 22 },
  { id: "cat-nails-manicure", name: "Маникюр", parentId: "cat-nails", slug: "manicure", productCount: 10 },
  { id: "cat-nails-pedicure", name: "Педикюр", parentId: "cat-nails", slug: "pedicure", productCount: 7 },
  { id: "cat-nails-design", name: "Дизайн ногтей", parentId: "cat-nails", slug: "nail-art", productCount: 5 },

  // 💆‍♀️ SPA
  { id: "cat-spa", name: "SPA", slug: "spa", productCount: 12 },
  { id: "cat-spa-massage", name: "Массаж", parentId: "cat-spa", slug: "massage", productCount: 6 },
  { id: "cat-spa-bath", name: "Баня и хаммам", parentId: "cat-spa", slug: "bath", productCount: 3 },
  { id: "cat-spa-body", name: "Уход за телом", parentId: "cat-spa", slug: "body-care", productCount: 3 },

  // 💆‍♂️ Лицо
  { id: "cat-face", name: "Лицо", slug: "face", productCount: 20 },
  { id: "cat-face-cleaning", name: "Чистка лица", parentId: "cat-face", slug: "face-cleaning", productCount: 5 },
  { id: "cat-face-masks", name: "Маски", parentId: "cat-face", slug: "face-masks", productCount: 4 },
  { id: "cat-face-care", name: "Уходовые процедуры", parentId: "cat-face", slug: "face-care", productCount: 7 },
  { id: "cat-face-injection", name: "Инъекции", parentId: "cat-face", slug: "injections", productCount: 4 },

  // 👁️‍🗨️ Брови и ресницы
  { id: "cat-brows", name: "Брови и ресницы", slug: "brows", productCount: 18 },
  { id: "cat-brows-shape", name: "Коррекция формы", parentId: "cat-brows", slug: "brow-shape", productCount: 6 },
  { id: "cat-brows-color", name: "Окрашивание", parentId: "cat-brows", slug: "brow-color", productCount: 4 },
  { id: "cat-brows-lashes", name: "Ламинирование ресниц", parentId: "cat-brows", slug: "lash-lifting", productCount: 8 },

  // 🧴 Косметика
  { id: "cat-cosmetics", name: "Косметика", slug: "cosmetics", productCount: 26 },
  { id: "cat-cosmetics-face", name: "Для лица", parentId: "cat-cosmetics", slug: "cosmetics-face", productCount: 9 },
  { id: "cat-cosmetics-body", name: "Для тела", parentId: "cat-cosmetics", slug: "cosmetics-body", productCount: 8 },
  { id: "cat-cosmetics-hair", name: "Для волос", parentId: "cat-cosmetics", slug: "cosmetics-hair", productCount: 9 },

  // 💡 Оборудование и аксессуары
  { id: "cat-equipment", name: "Оборудование", slug: "equipment", productCount: 10 },
  { id: "cat-tools", name: "Инструменты и аксессуары", slug: "tools", productCount: 15 },
  { id: "cat-furniture", name: "Салонная мебель", slug: "furniture", productCount: 6 },
  { id: "cat-uniform", name: "Форма и расходники", slug: "uniform", productCount: 8 },

  // 🎓 Обучение и сертификаты
  { id: "cat-education", name: "Обучение", slug: "education", productCount: 5 },
  { id: "cat-certs", name: "Сертификаты и курсы", slug: "certificates", productCount: 3 },
];

/** Утилиты */
export function getSubcategories(parentId: string) {
  return CATEGORIES.filter((c) => c.parentId === parentId);
}
export function findCategoryByKey(key: string) {
  const lower = key.toLowerCase();
  return CATEGORIES.find(
    (c) =>
      c.id === key ||
      c.slug === lower ||
      c.aliases?.some((a) => a.toLowerCase() === lower)
  );
}