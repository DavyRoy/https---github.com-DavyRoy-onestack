// app/demo/user/shop/products/data/mockAttributes.ts

/* =============================================================================
 * Типы и атрибуты для фасетных фильтров каталога
 * ============================================================================= */

/** Типы фасетов */
export type AttributeKind =
  | "text"
  | "select"
  | "multiselect"
  | "boolean"
  | "number"
  | "range";

/** Единицы измерения */
export type Unit =
  | "ml"
  | "g"
  | "hour"
  | "min"
  | "spf"
  | "rub"
  | "percent"
  | "none";

/** Описание одного атрибута товара */
export type ProductAttributeDefinition =
  | {
      id: string;
      label: string;
      kind: "text";
      placeholder?: string;
      description?: string;
    }
  | {
      id: string;
      label: string;
      kind: "select" | "multiselect";
      options: ReadonlyArray<{ value: string; label: string }>;
      description?: string;
    }
  | {
      id: string;
      label: string;
      kind: "boolean";
      trueLabel?: string;
      falseLabel?: string;
      description?: string;
    }
  | {
      id: string;
      label: string;
      kind: "number";
      unit?: Unit;
      min?: number;
      max?: number;
      step?: number;
      description?: string;
    }
  | {
      id: string;
      label: string;
      kind: "range";
      unit?: Unit;
      min: number;
      max: number;
      step?: number;
      description?: string;
    };

export type AttributeGroup = {
  categoryId: string;
  attributes: ReadonlyArray<ProductAttributeDefinition>;
};

export type BaseTag = { id: string; label: string };

/* =============================================================================
 * Утилиты
 * ============================================================================= */

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

const toNumber = (v: string | null | undefined): number | null => {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* =============================================================================
 * Атрибуты по категориям
 * ============================================================================= */

export const attributeGroups: AttributeGroup[] = [
  {
    categoryId: "face-serums",
    attributes: [
      {
        id: "skinType",
        label: "Тип кожи",
        kind: "select",
        options: [
          { value: "all", label: "Все" },
          { value: "dry", label: "Сухая" },
          { value: "oily", label: "Жирная" },
          { value: "combo", label: "Комбинированная" },
          { value: "sensitive", label: "Чувствительная" },
        ] as const,
      },
      {
        id: "texture",
        label: "Текстура",
        kind: "select",
        options: [
          { value: "light", label: "Лёгкая" },
          { value: "serum", label: "Сыворотка" },
          { value: "gel", label: "Гель" },
        ] as const,
      },
      { id: "spf", label: "SPF", kind: "boolean", trueLabel: "Есть SPF" },
      {
        id: "volume",
        label: "Объём",
        kind: "range",
        unit: "ml",
        min: 10,
        max: 100,
        step: 5,
      },
    ] as const,
  },

  {
    categoryId: "face-masks",
    attributes: [
      {
        id: "effect",
        label: "Эффект",
        kind: "multiselect",
        options: [
          { value: "hydrate", label: "Увлажнение" },
          { value: "cleanse", label: "Очищение" },
          { value: "repair", label: "Регенерация" },
          { value: "calm", label: "Успокаивающий" },
        ] as const,
      },
      { id: "nightUse", label: "Ночная", kind: "boolean" },
      {
        id: "volume",
        label: "Объём",
        kind: "range",
        unit: "ml",
        min: 30,
        max: 200,
        step: 10,
      },
    ] as const,
  },

  {
    categoryId: "body-scrubs",
    attributes: [
      {
        id: "particles",
        label: "Тип частиц",
        kind: "select",
        options: [
          { value: "salt", label: "Соль" },
          { value: "sugar", label: "Сахар" },
          { value: "coffee", label: "Кофе" },
        ] as const,
      },
      { id: "warming", label: "Согревающий эффект", kind: "boolean" },
      {
        id: "weight",
        label: "Вес",
        kind: "range",
        unit: "g",
        min: 100,
        max: 1000,
        step: 50,
      },
    ] as const,
  },

  {
    categoryId: "body-candles",
    attributes: [
      {
        id: "aroma",
        label: "Аромат",
        kind: "select",
        options: [
          { value: "citrus", label: "Цитрус" },
          { value: "amber", label: "Амбра" },
          { value: "lavender", label: "Лаванда" },
          { value: "vanilla", label: "Ваниль" },
        ] as const,
      },
      {
        id: "wick",
        label: "Фитиль",
        kind: "select",
        options: [
          { value: "cotton", label: "Хлопок" },
          { value: "wood", label: "Дерево" },
        ] as const,
      },
      {
        id: "burnTime",
        label: "Время горения",
        kind: "range",
        unit: "hour",
        min: 10,
        max: 80,
        step: 5,
      },
    ] as const,
  },
] as const;

/* =============================================================================
 * Теги
 * ============================================================================= */

export const baseTags: BaseTag[] = [
  { id: "sale", label: "Скидка" },
  { id: "bestseller", label: "Хит" },
  { id: "new", label: "Новинка" },
] as const;

/* =============================================================================
 * Вспомогательные индексы и утилиты
 * ============================================================================= */

export const ATTRIBUTES_BY_CATEGORY: Record<string, ReadonlyArray<ProductAttributeDefinition>> =
  Object.fromEntries(attributeGroups.map((g) => [g.categoryId, g.attributes]));

const UNIT_SYMBOL: Record<Unit, string> = {
  ml: "мл",
  g: "г",
  hour: "ч",
  min: "мин",
  spf: "SPF",
  rub: "₽",
  percent: "%",
  none: "",
};

export function getAttribute(categoryId: string, attrId: string) {
  return ATTRIBUTES_BY_CATEGORY[categoryId]?.find((a) => a.id === attrId) ?? null;
}

/** Получить символ единицы */
export function unitSymbol(u: Unit): string {
  return UNIT_SYMBOL[u] ?? "";
}

/* =============================================================================
 * Работа с фасетами
 * ============================================================================= */

export type FacetValue = string | number | boolean | [number, number];
export type FacetState = Record<string, FacetValue | FacetValue[] | undefined>;

/** Инициализация состояния фасетов */
export function buildDefaultFacetState(categoryId: string): FacetState {
  const defs = ATTRIBUTES_BY_CATEGORY[categoryId] ?? [];
  const state: FacetState = {};

  for (const def of defs) {
    switch (def.kind) {
      case "boolean":
        state[def.id] = false;
        break;
      case "select":
      case "number":
        state[def.id] = undefined;
        break;
      case "multiselect":
        state[def.id] = [];
        break;
      case "range":
        state[def.id] = [def.min, def.max];
        break;
      case "text":
        state[def.id] = "";
        break;
    }
  }

  return state;
}

/** Преобразование фасетов в query-параметры */
export function facetsToQuery(facets: FacetState): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, val] of Object.entries(facets)) {
    if (val == null || (Array.isArray(val) && val.length === 0) || val === "") continue;

    if (Array.isArray(val)) {
      // Диапазон
      if (val.length === 2 && typeof val[0] === "number" && typeof val[1] === "number") {
        params.set(key, `${val[0]},${val[1]}`);
      } else {
        // Мультиселект
        val.forEach((v) => params.append(key, String(v)));
      }
    } else if (typeof val === "boolean") {
      if (val) params.set(key, "1");
    } else {
      params.set(key, String(val));
    }
  }

  return params;
}

/** Парсинг query-параметров в состояние фасетов (с безопасными границами) */
export function queryToFacets(categoryId: string, searchParams: URLSearchParams): FacetState {
  const defs = ATTRIBUTES_BY_CATEGORY[categoryId] ?? [];
  const state = buildDefaultFacetState(categoryId);

  defs.forEach((def) => {
    const rawValues = searchParams.getAll(def.id);
    if (!rawValues.length) return;

    switch (def.kind) {
      case "boolean": {
        state[def.id] = rawValues[0] === "1";
        break;
      }
      case "select": {
        state[def.id] = rawValues[0];
        break;
      }
      case "multiselect": {
        const allowed = new Set(def.options.map((o) => o.value));
        state[def.id] = rawValues.filter((v) => allowed.has(v));
        break;
      }
      case "number": {
        const n = toNumber(rawValues[0]);
        state[def.id] = n ?? undefined;
        break;
      }
      case "range": {
        const [minStr, maxStr] = (rawValues[0] ?? "").split(",");
        const loRaw = toNumber(minStr);
        const hiRaw = toNumber(maxStr);
        const lo = loRaw == null ? def.min : clamp(loRaw, def.min, def.max);
        const hi = hiRaw == null ? def.max : clamp(hiRaw, def.min, def.max);
        state[def.id] = [Math.min(lo, hi), Math.max(lo, hi)];
        break;
      }
      case "text": {
        state[def.id] = rawValues[0];
        break;
      }
    }
  });

  return state;
}

/** Отображение значения фасета как текстовой метки */
export function formatFacetLabel(
  categoryId: string,
  key: string,
  value: FacetValue | FacetValue[] | undefined
): string | null {
  if (value == null || (Array.isArray(value) && value.length === 0) || value === "") return null;

  const def = getAttribute(categoryId, key);
  if (!def) return null;

  switch (def.kind) {
    case "boolean":
      return value ? def.trueLabel ?? def.label : null;

    case "select": {
      const label =
        (def.options as ReadonlyArray<{ value: string; label: string }>)?.find(
          (o) => o.value === value
        )?.label ?? String(value);
      return `${def.label}: ${label}`;
    }

    case "multiselect": {
      const values = (value as string[]).filter(Boolean);
      if (!values.length) return null;
      const labels = values
        .map((v) => (def.options as ReadonlyArray<{ value: string; label: string }>)?.find((o) => o.value === v)?.label ?? v)
        .join(", ");
      return `${def.label}: ${labels}`;
    }

    case "number":
      return `${def.label}: ${value}${
        def.unit && def.unit !== "none" ? ` ${unitSymbol(def.unit)}` : ""
      }`;

    case "range": {
      const [min, max] = value as [number, number];
      const unit = def.unit && def.unit !== "none" ? ` ${unitSymbol(def.unit)}` : "";
      return `${def.label}: ${min}–${max}${unit}`;
    }

    case "text":
      return `${def.label}: ${value}`;
  }
}