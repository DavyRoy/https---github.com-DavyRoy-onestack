// app/context/QuoteContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/** Источники оценки (расширено под веб-приложения) */
export type QuoteSource =
  | "sites-calculator"
  | "home-calculator"
  | "webapp-calculator"
  | "other";

/** Базовая смета (универсально) */
export type QuotePayload = {
  source: QuoteSource;
  createdAt: string; // ISO

  // Общие параметры (сайты)
  kind?: string;
  pages?: number;
  design?: string;
  seo?: string;
  hosting?: string;
  support?: string;
  speed?: string;

  // Деньги
  oneOff?: number;   // Единовременная стоимость
  monthly?: number;  // Ежемесячные расходы

  // Детализация (гибко)
  breakdown?: Record<string, number | string>;

  // --- Веб-приложения (не обяз., но удобно иметь типы) ---
  modules?: Record<string, boolean>;
  infra?: {
    useDB?: boolean;
    useCache?: boolean;
    useObserv?: boolean;
    useCI?: boolean;
  };
  // Доп. поля под конкретные калькуляторы
  [key: string]: unknown;
};

type Ctx = {
  quote: QuotePayload | null;
  /** Полностью заменить смету (или сбросить на null) */
  setQuote: (q: QuotePayload | null) => void;
  /** Часть обновить без потери остальных полей */
  updateQuote: (patch: Partial<QuotePayload>) => void;
  /** Сбросить и очистить сохранение */
  resetQuote: () => void;
};

const QuoteContext = createContext<Ctx>({
  quote: null,
  setQuote: () => {},
  updateQuote: () => {},
  resetQuote: () => {},
});

const STORAGE_KEY = "onestack_quote_v2";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [quote, setQuoteState] = useState<QuotePayload | null>(null);
  const hydrated = useRef(false);

  // Гидратация из localStorage (один раз на клиенте)
  useEffect(() => {
    if (!isBrowser() || hydrated.current) return;
    hydrated.current = true;
    const saved = safeParse<QuotePayload>(localStorage.getItem(STORAGE_KEY));
    if (saved?.createdAt) {
      setQuoteState(saved);
    }
  }, []);

  // Сохранение при изменении
  useEffect(() => {
    if (!isBrowser()) return;
    if (quote) localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    else localStorage.removeItem(STORAGE_KEY);
  }, [quote]);

  // Синхронизация между вкладками
  useEffect(() => {
    if (!isBrowser()) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = safeParse<QuotePayload>(e.newValue);
      setQuoteState(next ?? null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setQuote = (q: QuotePayload | null) => {
    setQuoteState(q);
  };

  const updateQuote = (patch: Partial<QuotePayload>) => {
    setQuoteState((prev) => {
      if (!prev) return (patch as QuotePayload) ?? null;
      return { ...prev, ...patch };
    });
  };

  const resetQuote = () => {
    setQuoteState(null);
  };

  const value = useMemo(
    () => ({ quote, setQuote, updateQuote, resetQuote }),
    [quote]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export const useQuote = () => useContext(QuoteContext);