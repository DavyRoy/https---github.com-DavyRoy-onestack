// app/lib/catalog/db.memory.ts
import { CATEGORIES as CATEGORIES_FOOD, PRODUCTS as PRODUCTS_FOOD } from "@/app/demo/(shared)/data/catalog";
import type { Category, Product } from "./types";
import { filterProducts, sortProducts, paginate, type Query } from "./filters";

export function getAllCategories(): Category[] {
  return CATEGORIES_FOOD;
}

export function getAllProducts(): Product[] {
  return PRODUCTS_FOOD;
}

/** NEW: количество товаров по категориям; "__none" — без категории */
export function countByCategory(): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of PRODUCTS_FOOD) {
    const key = p.categoryId ?? "__none";
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  return m;
}

// (опционально) если используешь фильтрацию/пагинацию
export function queryProducts(q: Query) {
  const filtered = filterProducts(PRODUCTS_FOOD, q);
  const sorted = sortProducts(filtered, q.sort);
  return paginate(sorted, q.page, q.perPage);
}

export { CATEGORIES_FOOD as CATEGORIES, PRODUCTS_FOOD as PRODUCTS };