import type { Product, ShopStats } from "./types";

export type Query = {
  q?: string;
  status?: "all" | "active" | "draft" | "archived";
  category?: string | "all" | "none";
  has_media?: "true" | "false" | "all"; // для совместимости, у нас всегда иконки → медиa нет
  sort?: "updated_desc" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
  offset?: number;
  limit?: number;
};

export function filterProducts(list: Product[], q: Query): Product[] {
  let xs = [...list];

  if (q.q) {
    const needle = q.q.toLowerCase();
    xs = xs.filter((p) =>
      p.name.toLowerCase().includes(needle) ||
      p.sku.toLowerCase().includes(needle) ||
      (p.barcode ?? "").toLowerCase().includes(needle)
    );
  }

  if (q.status && q.status !== "all") {
    xs = xs.filter((p) => p.status === q.status);
  }

  if (q.category === "none") {
    xs = xs.filter((p) => !p.categoryId);
  } else if (q.category && q.category !== "all") {
    xs = xs.filter((p) => p.categoryId === q.category);
  }

  if (q.has_media === "true") {
    xs = xs.filter(() => false); // картинок нет — значит 0
  }
  if (q.has_media === "false") {
    // все без картинок → остаётся весь список
  }

  return xs;
}

export function sortProducts(list: Product[], sort: Query["sort"]): Product[] {
  const xs = [...list];
  switch (sort) {
    case "price_asc":
      return xs.sort((a, b) => a.price - b.price);
    case "price_desc":
      return xs.sort((a, b) => b.price - a.price);
    case "name_asc":
      return xs.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    case "name_desc":
      return xs.sort((a, b) => b.name.localeCompare(a.name, "ru"));
    case "updated_desc":
    default:
      return xs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export function paginate<T>(list: T[], offset = 0, limit = 50) {
  const o = Math.max(0, offset);
  const l = Math.max(1, Math.min(200, limit));
  return list.slice(o, o + l);
}

export function computeShopStats(list: Product[]): ShopStats {
  const total = list.length;
  const active = list.filter((p) => p.status === "active").length;
  const noCategory = list.filter((p) => !p.categoryId).length;
  const noMedia = 0;
  return { total, active, noCategory, noMedia };
}