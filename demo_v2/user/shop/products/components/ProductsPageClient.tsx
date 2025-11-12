"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Sparkles, 
  RotateCcw,
  List,
  LayoutGrid,
  Zap,
  Target,
  ArrowRight,
  ShoppingCart,
  Heart,
  Compare
} from "lucide-react";

import Breadcrumbs from "./Breadcrumbs";
import ProductsHeader from "./ProductsHeader";
import ProductsFilters, { type ProductsFiltersValue } from "./ProductsFilters";
import ProductsToolbar from "./ProductsToolbar";
import ProductsList from "./ProductsList";
import FavoritesRail from "./FavoritesRail";
import RecentlyViewed from "./RecentlyViewed";
import { EmptySearch } from "./EmptyState";
import Pagination from "./Pagination";
import CompareDrawer from "./CompareDrawer";
import ProductQuickView from "../../components/ProductQuickView";
import ProductsGridBase from "../../components/ProductsGrid";

import { mockProducts, type ProductRow } from "../data/mockProducts";
import { mockUserShop } from "../../data/mockUserShop";
import { useUserStore } from "@/app/demo/store/userStore";
import { cn, BTN_PRIMARY, BTN_GHOST, CARD, TAPPABLE } from "./_shared";

// Параметры
const PAGE_SIZE = 12;

const initialFilters = (): ProductsFiltersValue => ({
  categories: [],
  brands: [],
  tags: [],
  inStock: false,
  price: { ...mockUserShop.priceRange },
  attributes: {},
});

// Фильтрация
function applyFilters(products: ProductRow[], filters: ProductsFiltersValue, query: string): ProductRow[] {
  const q = query.trim().toLowerCase();
  return products.filter((product) => {
    if (
      product.price < filters.price.min ||
      product.price > filters.price.max ||
      (filters.inStock && product.stock <= 0) ||
      (filters.categories.length && !filters.categories.includes(product.categoryId)) ||
      (filters.brands.length && !filters.brands.includes(product.brand)) ||
      (filters.tags.length && !filters.tags.some(tag => product.tags.includes(tag)))
    ) return false;

    for (const [key, val] of Object.entries(filters.attributes)) {
      const attr = product.attributes[key];
      if (typeof val === "boolean") {
        if (val && !attr) return false;
      } else if (typeof val === "string") {
        if (val && String(attr) !== val) return false;
      }
    }

    if (q.length) {
      const fields = [product.title, product.subtitle ?? "", product.description, product.brand, product.sku, ...product.tags];
      if (!fields.some(text => text?.toLowerCase().includes(q))) return false;
    }

    return true;
  });
}

// Сортировка
function sortProducts(products: ProductRow[], sort: string): ProductRow[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "new": return Number(b.isNew ?? false) - Number(a.isNew ?? false);
      case "rating_desc": return b.rating - a.rating;
      case "name_asc": return a.title.localeCompare(b.title);
      case "name_desc": return b.title.localeCompare(a.title);
      default: return b.reviewsCount - a.reviewsCount; // popular
    }
  });
}

export default function ProductsPageClient() {
  const router = useRouter();
  const params = useSearchParams();

  // Состояния
  const [products] = useState<ProductRow[]>(mockProducts);
  const [filters, setFilters] = useState<ProductsFiltersValue>(initialFilters);
  const [search, setSearch] = useState(() => params.get("q") ?? "");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("popular");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { addToCart, addToFavorites, removeFromFavorites, addToCompare, favorites = [], compareList = [] } = useUserStore();

  // Данные (фильтры + сортировка) + измерение времени
  const { filteredProducts, totalFiltered, durationMs } = useMemo(() => {
    const t0 = performance.now();
    const filtered = applyFilters(products, filters, search);
    const sorted = sortProducts(filtered, sort);
    const t1 = performance.now();
    return {
      filteredProducts: sorted,
      totalFiltered: sorted.length,
      durationMs: Math.round(t1 - t0),
    };
  }, [products, filters, search, sort]);

  // Отдельно обновляем время, чтобы не вызывать setState из useMemo
  useEffect(() => {
    setSearchTime(durationMs);
  }, [durationMs]);

  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const currentPageItems = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const shownCount = Math.min(currentPage * PAGE_SIZE, totalFiltered);

  const favoriteProducts = useMemo(() => {
    if (!favorites || !Array.isArray(favorites)) return [];
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);
  
  const recentlyViewed = useMemo(() => 
    products.filter((p) => p.recentlyViewed), 
    [products]
  );

  const breadcrumbs = useMemo(() => [
    { href: "/demo", label: "Демо" },
    { href: "/demo/user", label: "Кабинет" },
    { href: "/demo/user/shop", label: "Магазин" },
    { href: "/demo/user/shop/products", label: "Товары", isCurrent: true },
  ], []);

  // Подсчет активных фильтров
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length) count++;
    if (filters.brands.length) count++;
    if (filters.tags.length) count++;
    if (filters.inStock) count++;
    if (filters.price.min !== mockUserShop.priceRange.min || filters.price.max !== mockUserShop.priceRange.max) count++;
    
    const attrsActive = Object.values(filters.attributes).some((v) => {
      if (typeof v === "boolean") return v;
      return String(v ?? "").trim() !== "" && String(v) !== ",";
    });
    if (attrsActive) count++;
    
    return count;
  }, [filters]);

  // Управление выбором
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback((checked: boolean) => {
    setSelectedIds(checked ? currentPageItems.map((p) => p.id) : []);
  }, [currentPageItems]);

  // Действия
  const handleAddToCart = useCallback((product: ProductRow) => {
    const image = typeof product.thumbnail === "string" ? product.thumbnail : undefined;
    addToCart({ 
      productId: product.id, 
      title: product.title, 
      price: product.price, 
      image,
      sku: product.sku,
      brand: product.brand
    });
  }, [addToCart]);

  const handleAddToFavorites = useCallback((product: ProductRow) => {
    addToFavorites(product.id);
  }, [addToFavorites]);

  const handleRemoveFavorite = useCallback((id: string) => {
    removeFromFavorites(id);
  }, [removeFromFavorites]);

  const handleAddToCompare = useCallback((product: ProductRow) => {
    addToCompare(product.id);
  }, [addToCompare]);

  const handleFavoriteSelection = useCallback(() => {
    if (!selectedIds.length) return;
    selectedIds.forEach(id => addToFavorites(id));
  }, [selectedIds, addToFavorites]);

  const handleCompare = useCallback(() => {
    if (selectedIds.length) setCompareOpen(true);
  }, [selectedIds]);

  const handleQuickView = useCallback((product: ProductRow) => {
    setQuickViewProduct(product);
  }, []);

  // Обновляем URL-параметр ?q
  const updateQueryParams = useCallback((next: { q?: string }) => {
    const query = new URLSearchParams(params.toString());
    if (next.q !== undefined) {
      if (!next.q) query.delete("q");
      else query.set("q", next.q);
    }
    const str = query.toString();
    router.replace(str ? `/demo/user/shop/products?${str}` : `/demo/user/shop/products`, { scroll: false });
  }, [params, router]);

  const compareProducts = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [products, selectedIds]
  );

  // Сброс пагинации/выбора при изменении условий
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [search, filters, sort]);

  // Имитация загрузки
  useEffect(() => {
    if (search || activeFiltersCount > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        if (isInitialLoad) setIsInitialLoad(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [search, activeFiltersCount, isInitialLoad]);

  const handleSearchSubmit = useCallback((val?: string) => {
    updateQueryParams({ q: val ?? search });
  }, [search, updateQueryParams]);

  const handleFiltersChange = useCallback((next: ProductsFiltersValue) => {
    setFilters(next);
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters(initialFilters());
  }, []);

  const searchSuggestions = [
    "Смартфоны",
    "Ноутбуки",
    "Наушники",
    "Apple",
    "Samsung",
    "Игровые",
    "4K мониторы"
  ];

  // Безопасные флаги для QuickView
  const isFavorite = quickViewProduct ? (favorites?.includes?.(quickViewProduct.id) ?? false) : false;
  const inCompare = quickViewProduct ? (compareList?.includes?.(quickViewProduct.id) ?? false) : false;

  // Анимация появления контента
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Анимированный фон */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_70%)]" />
      </div>

      {/* Хлебные крошки */}
      <motion.div variants={itemVariants}>
        <Breadcrumbs 
          items={breadcrumbs} 
          variant="glass"
          className="mb-2"
        />
      </motion.div>

      {/* Заголовок и поиск */}
      <motion.div variants={itemVariants}>
        <ProductsHeader
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          view={view}
          onViewChange={setView}
          sort={sort}
          onSortChange={setSort}
          shown={shownCount}
          total={totalFiltered}
          onFiltersToggle={() => setMobileFiltersOpen(true)}
          filtersCount={activeFiltersCount}
          loading={loading}
          searchSuggestions={searchSuggestions}
          onSuggestionClick={(suggestion) => {
            setSearch(suggestion);
            handleSearchSubmit(suggestion);
          }}
          quickTags={["Скидки", "Новинки", "Хиты", "Премиум"]}
          onQuickTagClick={(tag) => {
            setSearch(tag);
            handleSearchSubmit(tag);
          }}
        />
      </motion.div>

      <motion.div 
        className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]"
        variants={itemVariants}
      >
        {/* Фильтры — слева */}
        <motion.div 
          className="hidden lg:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProductsFilters
            mode="inline"
            value={filters}
            priceRange={mockUserShop.priceRange}
            brands={mockUserShop.brands}
            tags={mockUserShop.tags}
            onChange={handleFiltersChange}
            onReset={handleFiltersReset}
            productCount={totalFiltered}
            loading={loading}
          />
        </motion.div>

        {/* Контент — справа */}
        <div className="flex flex-col gap-6">
          {/* Панель инструментов */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <ProductsToolbar
                  selectedCount={selectedIds.length}
                  onCompare={handleCompare}
                  onFavorite={handleFavoriteSelection}
                  onClear={() => setSelectedIds([])}
                  totalCount={totalFiltered}
                  shownCount={shownCount}
                  searchTime={searchTime}
                  searchQuery={search}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка мобильных фильтров */}
          <motion.button
            onClick={() => setMobileFiltersOpen(true)}
            className={cn(
              BTN_GHOST,
              "lg:hidden w-full items-center justify-center gap-3 rounded-2xl border-white/18 bg-white/10 px-4 py-3 text-sm font-semibold text-white/75 hover:border-white/25 hover:bg-white/14 hover:text-white backdrop-blur-xl"
            )}
            aria-haspopup="dialog"
            aria-controls="mobile-filters"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="h-5 w-5" />
            <span>Фильтры и сортировка</span>
            {activeFiltersCount > 0 && (
              <motion.span 
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-xs font-bold text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </motion.button>

          {/* Мобильные фильтры */}
          <ProductsFilters
            mode="sheet"
            visible={mobileFiltersOpen}
            value={filters}
            priceRange={mockUserShop.priceRange}
            brands={mockUserShop.brands}
            tags={mockUserShop.tags}
            onClose={() => setMobileFiltersOpen(false)}
            onApply={() => setMobileFiltersOpen(false)}
            onChange={handleFiltersChange}
            onReset={handleFiltersReset}
            productCount={totalFiltered}
            loading={loading}
          />

          {/* Лента избранного */}
          <AnimatePresence>
            {favoriteProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <FavoritesRail 
                  products={favoriteProducts} 
                  onRemove={handleRemoveFavorite}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                  compact={view === "list"}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Переключатель вида для мобильных */}
          <motion.div 
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 p-3 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-1 text-sm font-medium text-white/80 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              Вид:
            </div>
            <div className="flex gap-1 rounded-xl bg-white/10 p-1">
              {[
                { key: "grid" as const, icon: LayoutGrid, label: "Сетка" },
                { key: "list" as const, icon: List, label: "Список" }
              ].map(({ key, icon: Icon, label }) => (
                <motion.button
                  key={key}
                  onClick={() => setView(key)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 border",
                    TAPPABLE,
                    view === key
                      ? "border-blue-400/40 bg-blue-500/20 text-white shadow-lg shadow-blue-500/25"
                      : "border-white/15 text-white/60 hover:text-white/85 hover:bg-white/10"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Содержимое товаров */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={cn(CARD, "flex items-center justify-center py-20 bg-white/6")}
              >
                <div className="text-center">
                  <motion.div
                    className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-4"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white/95 mb-3">Поиск товаров...</h3>
                  <p className="text-white/60 text-sm">Применяем фильтры и сортировку</p>
                  <motion.div 
                    className="mt-6 h-1 w-48 bg-white/20 rounded-full overflow-hidden mx-auto"
                    initial={{ width: 0 }}
                    animate={{ width: 192 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                  </motion.div>
                </div>
              </motion.div>
            ) : currentPageItems.length ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                layout
              >
                {view === "list" ? (
                  <ProductsList
                    products={currentPageItems}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onToggleAll={toggleSelectAll}
                    onAddToCart={handleAddToCart}
                    onAddToFavorites={handleAddToFavorites}
                    onQuickView={handleQuickView}
                    onCompare={handleAddToCompare}
                    favorites={favorites || []}
                    compareList={compareList || []}
                    variant="detailed"
                    sortable={true}
                    onSort={() => {
                      // Локальную сортировку уже обрабатываем через общий state `sort`
                    }}
                    loading={loading}
                  />
                ) : (
                  <ProductsGridBase
                    products={currentPageItems}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onAddToFavorites={handleAddToFavorites}
                    onAddToCompare={handleAddToCompare}
                    favorites={favorites || []}
                    compareList={compareList || []}
                    variant="default"
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <EmptySearch 
                  title={search ? "По запросу ничего не найдено" : "Товары не найдены"}
                  description={
                    search 
                      ? "Попробуйте изменить поисковый запрос или использовать другие фильтры"
                      : "Попробуйте изменить параметры фильтров или сбросить их"
                  }
                  action={
                    <motion.button
                      onClick={handleFiltersReset}
                      className={cn(BTN_PRIMARY, "rounded-xl px-6 py-2.5 flex items-center gap-2")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Сбросить фильтры
                    </motion.button>
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Пагинация */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalFiltered}
                itemsPerPage={PAGE_SIZE}
                onPageChange={setCurrentPage}
                variant="cards"
                showInfo={true}
                className="mt-4"
                loading={loading}
              />
            </motion.div>
          )}

          {/* Недавно просмотренные */}
          <AnimatePresence>
            {recentlyViewed.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <RecentlyViewed 
                  products={recentlyViewed} 
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Модальные окна */}
      <CompareDrawer 
        open={compareOpen} 
        products={compareProducts} 
        onClose={() => setCompareOpen(false)}
        onAddToCart={handleAddToCart}
        maxProducts={4}
      />

      <ProductQuickView
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToFavorites={handleAddToFavorites}
        onAddToCompare={handleAddToCompare}
        isFavorite={isFavorite}
        inCompare={inCompare}
      />

      {/* Плавающая кнопка действий */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
            initial={{ opacity: 0, scale: 0, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <motion.button
              className={cn(
                "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl",
                "bg-gradient-to-r from-blue-500 to-cyan-500 text-white backdrop-blur-lg",
                "border-2 border-blue-400/40"
              )}
              onClick={handleFavoriteSelection}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-4 w-4" />
              В избранное
            </motion.button>
            
            <motion.button
              className={cn(
                "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl",
                "bg-gradient-to-r from-purple-500 to-pink-500 text-white backdrop-blur-lg",
                "border-2 border-purple-400/40"
              )}
              onClick={handleCompare}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Compare className="h-4 w-4" />
              Сравнить
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
