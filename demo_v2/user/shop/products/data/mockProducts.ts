import type { ShopProduct } from "../../data/mockUserShop";
import { mockUserShop } from "../../data/mockUserShop";

/** Детерминированный PRNG (стабильно на SSR/CSR) */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Выбор случайного элемента из массива */
const pick = <T,>(arr: readonly T[], rnd: () => number): T =>
  arr[Math.floor(rnd() * arr.length)];

/** Диапазон с шагом — одно детерминированное значение */
const pickStepped = (min: number, max: number, step: number, rnd: () => number) => {
  const steps = Math.floor((max - min) / step);
  const idx = Math.floor(rnd() * (steps + 1));
  return min + idx * step;
};

/** Это строка-URL? (http, https или абсолютный путь /) */
const looksLikeUrl = (s: string) => /^(https?:)?\/\//.test(s) || s.startsWith("/");

/** Экранирование текста для SVG */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Превращаем «иконку»/текст в data-URL SVG плейсхолдер (для поля src) */
function iconToDataUrl(label: string): string {
  const text = label.replace(/^icon:/, "").trim() || "★";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="16" fill="#0b0f1a"/>
  <rect x="1" y="1" width="318" height="238" rx="15" fill="url(#g)" stroke="#2b3242" stroke-width="2"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="ui-sans-serif, -apple-system, Segoe UI, Roboto, Inter, system-ui"
        font-size="64" fill="#e5e7eb">${esc(text)}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Нормализация thumbnail: если это не URL — рисуем SVG data-URL */
const normalizeThumbnail = (thumb: string): string =>
  looksLikeUrl(thumb) ? thumb : iconToDataUrl(thumb);

/** Расширенная структура одного товара */
export type ProductRow = ShopProduct & {
  sku: string;
  stock: number;
  attributes: Record<string, string | boolean | number | [number, number]>;
  favorite?: boolean;
  recentlyViewed?: boolean;
};

/* =============================================================================
 * Диапазоны по категориям
 * ============================================================================= */

const volumeRangeSerum = { min: 10, max: 100, step: 5 };
const volumeRangeMask = { min: 30, max: 200, step: 10 };
const weightRangeScrub = { min: 100, max: 1000, step: 50 };
const burnTimeRangeCandle = { min: 10, max: 80, step: 5 };

/* =============================================================================
 * Массив товаров с псевдослучайными атрибутами
 * ============================================================================= */

export const mockProducts: ProductRow[] = mockUserShop.products.map((product, index) => {
  const rnd = mulberry32(index + 1);
  const sku = `SKU-${1000 + index}-${product.id.slice(-4)}`;

  const stock = product.inStock ? 3 + Math.floor(rnd() * 22) : 0;
  const attrs: Record<string, string | boolean | number | [number, number]> = {};

  switch (product.categoryId) {
    case "face-serums": {
      const skinTypes = ["all", "dry", "oily", "combo", "sensitive"] as const;
      const textures = ["light", "serum", "gel"] as const;

      const skin = pick(skinTypes, rnd);
      const texture = pick(textures, rnd);
      const spf = rnd() > 0.4;
      const vol = pickStepped(
        volumeRangeSerum.min,
        volumeRangeSerum.max,
        volumeRangeSerum.step,
        rnd
      );

      Object.assign(attrs, {
        skinType: skin,
        texture,
        spf,
        volume: [vol, vol],
      });
      break;
    }

    case "face-masks": {
      const effects = ["hydrate", "cleanse", "repair", "calm"] as const;
      const effect = pick(effects, rnd);
      const nightUse = rnd() > 0.5;

      const v1 = pickStepped(
        volumeRangeMask.min,
        volumeRangeMask.max,
        volumeRangeMask.step,
        rnd
      );
      const v2 = pickStepped(
        volumeRangeMask.min,
        volumeRangeMask.max,
        volumeRangeMask.step,
        rnd
      );

      Object.assign(attrs, {
        effect: [effect],
        nightUse,
        volume: [Math.min(v1, v2), Math.max(v1, v2)],
      });
      break;
    }

    case "body-scrubs": {
      const particles = ["salt", "sugar", "coffee"] as const;
      const particle = pick(particles, rnd);
      const warming = rnd() > 0.5;

      const w = pickStepped(
        weightRangeScrub.min,
        weightRangeScrub.max,
        weightRangeScrub.step,
        rnd
      );

      Object.assign(attrs, {
        particles: particle,
        warming,
        weight: [w, w],
      });
      break;
    }

    case "body-candles": {
      const aromas = ["citrus", "amber", "lavender", "vanilla"] as const;
      const wicks = ["cotton", "wood"] as const;

      const aroma = pick(aromas, rnd);
      const wick = pick(wicks, rnd);
      const burn = pickStepped(
        burnTimeRangeCandle.min,
        burnTimeRangeCandle.max,
        burnTimeRangeCandle.step,
        rnd
      );

      Object.assign(attrs, {
        aroma,
        wick,
        burnTime: [burn, burn],
      });
      break;
    }

    default:
      break;
  }

  return {
    ...product,
    thumbnail: normalizeThumbnail(product.thumbnail),
    images: (product.images ?? []).map((src) => (looksLikeUrl(src) ? src : iconToDataUrl(String(src)))),
    sku,
    stock,
    attributes: attrs,
    favorite: rnd() > 0.66,
    recentlyViewed: rnd() > 0.5,
  };
});

/** Общее кол-во доступных товаров в базе (для пагинации/фейковой статистики) */
export const totalProductsAvailable = 136;