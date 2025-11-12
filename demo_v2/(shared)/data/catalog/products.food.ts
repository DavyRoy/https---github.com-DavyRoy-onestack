import type { Product } from "@/app/lib/catalog/types";
import { CATEGORIES } from "./categories.food";

/**
 * Генерация ~100 товаров: по 10 на каждую подкатегорию.
 * Без картинок, только iconId (берем из категории).
 */

const SUBCATS = CATEGORIES.filter((c) => c.parentId);

function pad(n: number) {
  return n.toString().padStart(3, "0");
}

function skuFrom(catSlug: string, i: number) {
  return `${catSlug.toUpperCase().slice(0, 3)}-${pad(i)}`;
}

function nameFrom(catName: string, i: number) {
  return `${catName} — товар №${i}`;
}

const today = new Date().toISOString().slice(0, 10);

export const PRODUCTS: Product[] = SUBCATS.flatMap((cat) => {
  const list: Product[] = [];
  for (let i = 1; i <= 10; i++) {
    // детерминированные «псевдослучайные» цена/остаток по индексам
    const price = 100 + ((i * 73) % 900);     // 100..999
    const stock = (i * 13) % 30;              // 0..29
    const status: Product["status"] =
      i % 10 === 0 ? "draft" : i % 9 === 0 ? "archived" : "active";
    list.push({
      id: `food-${cat.id}-${pad(i)}`,
      name: nameFrom(cat.name, i),
      sku: skuFrom(cat.slug, i),
      barcode: `46${(i * 7919).toString().padStart(10, "0")}`,
      categoryId: cat.id,
      price,
      stock,
      status,
      updatedAt: today,
      iconId: cat.iconId,
    });
  }
  return list;
});