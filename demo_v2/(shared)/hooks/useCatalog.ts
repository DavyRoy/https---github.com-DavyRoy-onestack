"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/app/lib/catalog/types";

// Памятная (in-memory) реализация — быстрая и без сетевых запросов
import {
  getAllCategories as memGetCats,
  getAllProducts as memGetProducts,
  countByCategory as memCountByCategory,
} from "@/app/lib/catalog/db.memory";

type Source = "food";
type Strategy = "memory" | "api";

export type UseCatalogOptions = {
  /** Набор мок-данных; сейчас один — "food" */
  source?: Source;
  /** Откуда брать данные: локальная память (по умолчанию) или API */
  strategy?: Strategy;
  /** Авто-подгрузка при маунте */
  autoload?: boolean;
};

export type UseCatalogResult = {
  loading: boolean;
  error: string | null;
  categories: Category[];
  products: Product[];
  /** количество товаров по категориям; "__none" — без категории */
  countsByCategory: Map<string, number>;
  /** ручное обновление */
  refresh: () => void;
};

/**
 * Единый хук для витрины/админки.
 * По умолчанию использует in-memory мок-БД; при strategy="api" будет ходить в API-роуты.
 */
export function useCatalog(options: UseCatalogOptions = {}): UseCatalogResult {
  const { source = "food", strategy = "memory", autoload = true } = options;

  const [loading, setLoading] = useState<boolean>(autoload);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [countsByCategory, setCounts] = useState<Map<string, number>>(new Map());

  const loadMemory = useCallback(() => {
    // source пока не влияет: у нас один набор моков "food"
    const cats = memGetCats();
    const prods = memGetProducts();
    const counts = memCountByCategory();
    setCategories(cats);
    setProducts(prods);
    setCounts(counts);
  }, []);

  const loadApi = useCallback(async () => {
    // Берём из наших API-роутов, чтобы показать, как это может выглядеть
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch(`/api/catalog/categories?source=${encodeURIComponent(source)}`, { cache: "no-store" }),
        fetch(`/api/catalog/products?source=${encodeURIComponent(source)}`, { cache: "no-store" }),
      ]);
      if (!catsRes.ok || !prodsRes.ok) {
        throw new Error(`HTTP ${catsRes.status}/${prodsRes.status}`);
      }
      const cats = (await catsRes.json()) as Category[];
      const prods = (await prodsRes.json()) as Product[];

      // посчитаем распределение по категориям
      const m = new Map<string, number>();
      for (const p of prods) {
        const key = p.categoryId ?? "__none";
        m.set(key, (m.get(key) ?? 0) + 1);
      }

      setCategories(cats);
      setProducts(prods);
      setCounts(m);
    } catch (e: any) {
      throw new Error(e?.message || "Failed to fetch catalog");
    }
  }, [source]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    if (strategy === "api") {
      loadApi()
        .catch((e) => {
          setError(String(e?.message || e));
          // мягкий фоллбек на память
          loadMemory();
        })
        .finally(() => setLoading(false));
    } else {
      try {
        loadMemory();
      } catch (e: any) {
        setError(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    }
  }, [strategy, loadApi, loadMemory]);

  useEffect(() => {
    if (!autoload) return;
    refresh();
  }, [autoload, refresh]);

  // Мемо чтобы не пересоздавать Map на ререндере
  const memoCounts = useMemo(() => countsByCategory, [countsByCategory]);

  return {
    loading,
    error,
    categories,
    products,
    countsByCategory: memoCounts,
    refresh,
  };
}

// (опционально) дефолтный экспорт — не обязателен, но безвреден
export default useCatalog;