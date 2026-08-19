import "server-only";
import { FALLBACK_USD_RUB } from "./rateFallback";

/**
 * Курс USD → RUB по данным ЦБ РФ, получаемый на сервере.
 *
 * Считается именно на сервере, а не в браузере: тогда цена в долларах
 * попадает уже в отрендеренный HTML и видна даже если клиентский JS
 * не отработал. Ответ кешируется на сутки — курс ЦБ обновляется раз в день.
 */

export { FALLBACK_USD_RUB } from "./rateFallback";

const CBR_URL = "https://www.cbr-xml-daily.ru/daily_json.js";
const DAY = 86_400;

export async function getUsdRate(): Promise<number> {
  try {
    const res = await fetch(CBR_URL, {
      next: { revalidate: DAY },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) throw new Error(`ЦБ ответил ${res.status}`);

    const data = await res.json();
    const value = data?.Valute?.USD?.Value;

    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      throw new Error("В ответе ЦБ нет корректного курса USD");
    }
    return value;
  } catch {
    // Цену показать важнее, чем сообщить о недоступности внешнего сервиса.
    return FALLBACK_USD_RUB;
  }
}
