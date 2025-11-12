"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Clock, 
  X, 
  ShoppingCart, 
  Heart,
  Star,
  Sparkles,
  ChevronRight,
  Zap,
  ArrowRight,
  History
} from "lucide-react";
import type { ProductRow } from "../data/mockProducts";
import { 
  cn, 
  CARD, 
  TAPPABLE,
  CHIP,
  BTN_GHOST,
  PRODUCT_CARD,
  PRODUCT_IMAGE,
  PRODUCT_CONTENT,
  PRODUCT_PRICE,
  PRODUCT_OLD_PRICE,
  PRODUCT_DISCOUNT
} from "./_shared";

type RecentlyViewedProps = {
  products: ProductRow[];
  maxItems?: number;
  variant?: "default" | "compact" | "carousel" | "glass";
  showActions?: boolean;
  onAddToCart?: (product: ProductRow) => void;
  onAddToFavorites?: (product: ProductRow) => void;
  onRemove?: (productId: string) => void;
  onQuickView?: (product: ProductRow) => void;
  className?: string;
  autoRotate?: boolean;
};

export default function RecentlyViewed({ 
  products, 
  maxItems = 8,
  variant = "default",
  showActions = true,
  onAddToCart,
  onAddToFavorites,
  onRemove,
  onQuickView,
  className,
  autoRotate = false
}: RecentlyViewedProps) {
  const [expanded, setExpanded] = useState(false);
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(product => !removedItems.has(product.id));
    return expanded ? filtered : filtered.slice(0, maxItems);
  }, [products, removedItems, expanded, maxItems]);

  const canExpand = products.length > maxItems;

  // Автопрокрутка для карусели
  const carouselProducts = useMemo(() => {
    if (variant !== "carousel") return [];
    const filtered = products.filter(product => !removedItems.has(product.id));
    return expanded ? filtered : filtered.slice(0, Math.min(maxItems * 2, filtered.length));
  }, [products, removedItems, expanded, maxItems, variant]);

  const handleRemove = (productId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setRemovedItems(prev => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
    onRemove?.(productId);
  };

  const handleAddToCart = (product: ProductRow, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToFavorites = (product: ProductRow, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToFavorites?.(product);
  };

  const handleQuickView = (product: ProductRow, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onQuickView?.(product);
  };

  const renderProductImage = (product: ProductRow) => {
    if (typeof product.thumbnail === "string" && product.thumbnail) {
      return (
        <div className="relative h-full w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.thumbnail}
            alt={product.title}
            width={variant === "compact" ? 48 : 64}
            height={variant === "compact" ? 48 : 64}
            className={cn(
              "h-full w-full object-cover transition-all duration-500 group-hover:scale-110",
              variant === "compact" ? "rounded-lg" : "rounded-xl"
            )}
            loading="lazy"
          />
          {/* Градиентный оверлей */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      );
    }

    if (typeof product.icon === "string" && product.icon) {
      return (
        <motion.div
          className={cn(
            "text-white/60 transition-all duration-300 group-hover:text-white/80 group-hover:scale-110",
            variant === "compact" ? "text-2xl" : "text-3xl"
          )}
          whileHover={{ scale: 1.1 }}
        >
          {product.icon}
        </motion.div>
      );
    }

    return (
      <div className="text-white/40 transition-colors duration-300 group-hover:text-white/60">
        <Sparkles className={variant === "compact" ? "h-6 w-6" : "h-8 w-8"} />
      </div>
    );
  };

  const renderRating = (rating: number) => {
    return (
      <motion.div 
        className="flex items-center gap-1"
        whileHover={{ scale: 1.05 }}
      >
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
        <span className="text-xs font-medium text-white/80">{rating.toFixed(1)}</span>
      </motion.div>
    );
  };

  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <motion.div 
          className={cn(CHIP, "bg-red-500/20 border-2 border-red-400/30 text-red-300 text-xs")}
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="h-3 w-3 mr-1" />
          Нет в наличии
        </motion.div>
      );
    }
    if (stock < 10) {
      return (
        <motion.div 
          className={cn(CHIP, "bg-orange-500/20 border-2 border-orange-400/30 text-orange-300 text-xs")}
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="h-3 w-3 mr-1" />
          Мало ({stock})
        </motion.div>
      );
    }
    return null;
  };

  const isCompact = variant === "compact";
  const isCarousel = variant === "carousel";
  const isGlass = variant === "glass";

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
    <motion.section
      aria-labelledby="recently-viewed-title"
      className={cn(
        CARD,
        "relative space-y-4 transition-all duration-500",
        isCompact ? "px-4 py-5" : "px-5 py-6 sm:px-6 sm:py-8",
        className,
        isGlass && "border-white/18 bg-white/10 backdrop-blur-xl",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Анимированный фон для glass варианта */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.2),transparent_65%)] blur-[110px]" />
        <div className="absolute -bottom-24 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_60%)] blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
      </div>

      {/* Заголовок и навигация */}
      <motion.div 
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
              "border-2 border-purple-400/30 text-purple-300 backdrop-blur-lg"
            )}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <History className="h-5 w-5" />
          </motion.div>
          <div>
            <h3 id="recently-viewed-title" className="text-lg font-semibold text-white/95 flex items-center gap-2">
              Недавно просмотренные
              {products.length > 0 && (
                <motion.span 
                  className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {products.length}
                </motion.span>
              )}
            </h3>
            <p className="text-sm text-white/60">
              Вернитесь к товарам, которые вас заинтересовали
            </p>
          </div>
        </div>

        {canExpand && (
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              BTN_GHOST,
              "hidden sm:flex items-center gap-2 rounded-xl border-2 border-white/12 bg-white/8 px-4 py-2 text-sm",
              "hover:bg-white/12 hover:border-white/18 transition-all duration-300 backdrop-blur-lg"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {expanded ? "Свернуть" : `Ещё +${products.length - maxItems}`}
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </motion.button>
        )}
      </motion.div>

      {/* Сетка товаров */}
      <AnimatePresence mode="wait">
        {visibleProducts.length > 0 ? (
          <motion.div
            key="products-grid"
            className={cn(
              "grid gap-3",
              isCompact && "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6",
              !isCompact && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
              isCarousel && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8"
            )}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                custom={index}
                layout
              >
                <Link
                  href={`/demo/user/shop/${product.slug}`}
                  prefetch={false}
                  className={cn(
                    PRODUCT_CARD,
                    "group relative flex flex-col overflow-hidden border border-white/15 transition-all duration-500",
                    "hover:border-white/25 hover:shadow-2xl hover:shadow-purple-500/20",
                    isCompact && "flex-row items-center p-3",
                    !isCompact && "p-4",
                    isCarousel && "min-w-[140px]"
                  )}
                  aria-label={`Перейти к товару: ${product.title}. Цена: ${product.price.toLocaleString('ru-RU')} рублей. Рейтинг: ${product.rating.toFixed(1)}.`}
                >
                  {/* Кнопка удаления */}
                  {onRemove && (
                    <motion.button
                      onClick={(e) => handleRemove(product.id, e)}
                      className={cn(
                        TAPPABLE,
                        "absolute right-2 top-2 z-10",
                        "flex h-7 w-7 items-center justify-center rounded-full",
                        "border-2 border-white/12 bg-black/60 backdrop-blur-xl",
                        "text-white/70 transition-all duration-300",
                        "hover:bg-red-500/80 hover:text-white hover:border-red-400/50",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                        "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      )}
                      aria-label={`Удалить "${product.title}" из истории просмотров`}
                      title="Удалить из истории"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                  )}

                  {/* Изображение товара */}
                  <motion.div
                    className={cn(
                      PRODUCT_IMAGE,
                      "relative flex items-center justify-center overflow-hidden",
                      isCompact ? "h-12 w-12 rounded-lg" : "h-32 rounded-xl",
                      isCarousel && "h-24"
                    )}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {renderProductImage(product)}
                    
                    {/* Бейдж скидки */}
                    {product.oldPrice && product.oldPrice > product.price && (
                      <motion.div 
                        className={cn(
                          PRODUCT_DISCOUNT,
                          "absolute left-2 top-2 px-2 py-1 rounded-full text-xs font-bold shadow-lg",
                          "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </motion.div>
                    )}

                    {/* Индикатор просмотра */}
                    <motion.div 
                      className="absolute left-2 bottom-2"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Eye className="h-3 w-3 text-white/60" />
                    </motion.div>
                  </motion.div>

                  {/* Контент товара */}
                  <div className={cn(
                    PRODUCT_CONTENT,
                    "flex-1 flex flex-col",
                    isCompact && "!p-0 !pl-3 gap-1",
                    isCarousel && "!p-2 gap-1"
                  )}>
                    {/* Основная информация */}
                    <div className={cn("flex-1", isCompact && "min-w-0")}>
                      <h4 className={cn(
                        "font-semibold text-white/95 line-clamp-2 leading-tight mb-1",
                        "group-hover:text-white transition-colors duration-300",
                        isCompact ? "text-sm" : "text-base",
                        isCarousel && "text-sm"
                      )}>
                        {product.title}
                      </h4>
                      
                      {!isCompact && (
                        <p className="text-xs text-white/60 mb-2 line-clamp-2">
                          {product.brand}
                        </p>
                      )}

                      {/* Рейтинг и наличие */}
                      <div className="flex items-center justify-between mb-2">
                        {!isCarousel && renderRating(product.rating)}
                        {renderStockBadge(product.stock)}
                      </div>
                    </div>

                    {/* Цена и действия */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className={cn(
                          PRODUCT_PRICE,
                          isCompact ? "text-sm" : "text-base font-semibold",
                          isCarousel && "text-sm"
                        )}>
                          {product.price.toLocaleString("ru-RU")} ₽
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className={cn(
                            PRODUCT_OLD_PRICE,
                            isCompact ? "text-xs" : "text-sm",
                            isCarousel && "text-xs"
                          )}>
                            {product.oldPrice.toLocaleString("ru-RU")} ₽
                          </span>
                        )}
                      </div>

                      {/* Быстрые действия */}
                      {showActions && !isCompact && (
                        <motion.div 
                          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          {onAddToCart && (
                            <motion.button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={product.stock === 0}
                              className={cn(
                                TAPPABLE,
                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                "border-2 border-white/12 bg-white/8 text-white/70",
                                "hover:bg-white/12 hover:text-white hover:border-white/18",
                                "transition-all duration-300 backdrop-blur-lg",
                                product.stock === 0 && "opacity-50 pointer-events-none grayscale"
                              )}
                              aria-label={`Добавить "${product.title}" в корзину`}
                              title="В корзину"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                            </motion.button>
                          )}

                          {onAddToFavorites && (
                            <motion.button
                              onClick={(e) => handleAddToFavorites(product, e)}
                              className={cn(
                                TAPPABLE,
                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                "border-2 border-white/12 bg-white/8 text-white/70",
                                "hover:bg-white/12 hover:text-white hover:border-white/18",
                                "transition-all duration-300 backdrop-blur-lg"
                              )}
                              aria-label={`Добавить "${product.title}" в избранное`}
                              title="В избранное"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Heart className="h-3.5 w-3.5" />
                            </motion.button>
                          )}

                          {onQuickView && (
                            <motion.button
                              onClick={(e) => handleQuickView(product, e)}
                              className={cn(
                                TAPPABLE,
                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                "border-2 border-white/12 bg-white/8 text-white/70",
                                "hover:bg-white/12 hover:text-white hover:border-white/18",
                                "transition-all duration-300 backdrop-blur-lg"
                              )}
                              aria-label={`Быстрый просмотр "${product.title}"`}
                              title="Быстрый просмотр"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Компактные действия */}
                    {showActions && isCompact && (
                      <motion.div 
                        className="flex gap-1 mt-1"
                        whileHover={{ scale: 1.02 }}
                      >
                        {onAddToCart && (
                          <motion.button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.stock === 0}
                            className={cn(
                              "flex-1 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-300",
                              "border-2 border-white/12 bg-white/8 text-white/70",
                              "hover:bg-white/12 hover:text-white hover:border-white/18 backdrop-blur-lg",
                              product.stock === 0 && "opacity-50 pointer-events-none grayscale"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ShoppingCart className="h-3 w-3 inline mr-1" />
                            В корзину
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Пустое состояние после удаления всех */
          products.length > 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <History className="h-10 w-10 text-white/40" />
              </motion.div>
              <h4 className="text-xl font-semibold text-white/95 mb-3">
                История просмотров очищена
              </h4>
              <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                Новые просмотренные товары появятся здесь автоматически
              </p>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Кнопка "Показать ещё" для мобильных */}
      {canExpand && (
        <motion.div 
          className="sm:hidden flex justify-center pt-4 border-t border-white/10"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              BTN_GHOST,
              "flex items-center gap-2 rounded-xl border-2 border-white/12 bg-white/8 px-4 py-2 text-sm",
              "hover:bg-white/12 hover:border-white/18 transition-all duration-300 backdrop-blur-lg"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {expanded ? "Свернуть" : `Показать ещё ${products.length - maxItems}`}
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
}

// Компонент для отображения в виде карусели
export function RecentlyViewedCarousel(props: Omit<RecentlyViewedProps, 'variant'>) {
  return (
    <RecentlyViewed
      {...props}
      variant="carousel"
    />
  );
}

// Компонент для компактного отображения
export function RecentlyViewedCompact(props: Omit<RecentlyViewedProps, 'variant'>) {
  return (
    <RecentlyViewed
      {...props}
      variant="compact"
    />
  );
}

// Компонент для glass отображения
export function RecentlyViewedGlass(props: Omit<RecentlyViewedProps, 'variant'>) {
  return (
    <RecentlyViewed
      {...props}
      variant="glass"
    />
  );
}
