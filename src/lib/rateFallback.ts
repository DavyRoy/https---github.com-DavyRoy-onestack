/**
 * Запасной курс USD → RUB на случай недоступности ЦБ.
 *
 * Вынесен в отдельный модуль, потому что нужен и на сервере (lib/rate.ts),
 * и в клиентском контексте (app/context/RateContext.tsx), а lib/rate.ts
 * помечен "server-only" и в клиентский бандл попасть не может.
 */
export const FALLBACK_USD_RUB = 95;
