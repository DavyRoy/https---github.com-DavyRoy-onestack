"use client";
import { createContext, useContext } from "react";
import { FALLBACK_USD_RUB } from "@/lib/rateFallback";

/**
 * Курс USD → RUB приходит из серверного layout (см. lib/rate.ts) и раздаётся
 * калькуляторам через контекст. Клиент в сеть не ходит: значение уже
 * присутствует в HTML, поэтому цены корректны с первого кадра.
 */
const RateContext = createContext<number>(FALLBACK_USD_RUB);

export function RateProvider({ rate, children }: { rate: number; children: React.ReactNode }) {
  return <RateContext.Provider value={rate}>{children}</RateContext.Provider>;
}

export function useUsdRate() {
  return useContext(RateContext);
}
