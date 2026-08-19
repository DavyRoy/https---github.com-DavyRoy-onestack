"use client";
import { useCallback } from "react";
import { useUsdRate } from "@/app/context/RateContext";

/**
 * Форматирование сумм в калькуляторах.
 *
 * Все прайс-таблицы ведутся в рублях — это исходная валюта бизнеса.
 * В англоязычной версии те же суммы пересчитываются в доллары по курсу
 * ЦБ РФ. Курс приходит из серверного layout через контекст, поэтому
 * пересчёт происходит уже при рендере на сервере — цена корректна в HTML
 * и не зависит от того, отработал ли клиентский JS.
 */

/** Округление, чтобы в смете не было цен вида «$1 487» — только круглые. */
function roundNice(value: number): number {
  if (value <= 0) return 0;
  if (value < 100) return Math.round(value);
  if (value < 1_000) return Math.round(value / 10) * 10;
  if (value < 10_000) return Math.round(value / 50) * 50;
  if (value < 100_000) return Math.round(value / 100) * 100;
  return Math.round(value / 1_000) * 1_000;
}

export function useMoney(lang: "ru" | "en") {
  const usdRub = useUsdRate();

  /** Число в валюте локали, без символа. */
  const amount = useCallback((rub: number) => (
    lang === "en" ? roundNice(rub / usdRub) : Math.round(rub)
  ), [lang, usdRub]);

  /** Готовая строка с символом валюты: «1 250 000 ₽» / «$13,000». */
  const money = useCallback((rub: number) => {
    const v = amount(rub);
    return lang === "en"
      ? `$${v.toLocaleString("en-US")}`
      : `${v.toLocaleString("ru-RU")} ₽`;
  }, [amount, lang]);

  /** Сумма в месяц: «81 000 ₽/мес» / «$850/mo». */
  const moneyPerMonth = useCallback((rub: number) => (
    lang === "en" ? `${money(rub)}/mo` : `${money(rub)}/мес`
  ), [money, lang]);

  const currencySymbol = lang === "en" ? "$" : "₽";

  return { money, moneyPerMonth, amount, currencySymbol, usdRub };
}
