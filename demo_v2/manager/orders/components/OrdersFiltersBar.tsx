"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { MANAGERS } from "@/app/demo/manager/orders/data/mockOrders";

export default function OrdersFiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ---- Истина из URL
  const qUrl = sp.get("q") ?? "";
  const status = sp.get("status") ?? "";
  const owner = sp.get("owner") ?? "";

  // ---- Локальный инпут с дебаунсом
  const [qInput, setQInput] = useState(qUrl);
  useEffect(() => setQInput(qUrl), [qUrl]);

  // Применить параметр в URL. Для фильтров используем replace (не спамим историю)
  const setParam = (key: string, val?: string) => {
    const next = new URLSearchParams(sp.toString());
    if (!val) next.delete(key);
    else next.set(key, val);
    router.replace(`${pathname}?${next.toString()}`);
  };

  // Дебаунс для поиска
  useEffect(() => {
    const t = setTimeout(() => setParam("q", qInput || undefined), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qInput]);

  const reset = () => {
    const keep: string[] = []; // если надо сохранить что-то ещё — добавьте сюда
    const next = new URLSearchParams(sp.toString());
    ["q", "status", "owner"].forEach((k) => {
      if (!keep.includes(k)) next.delete(k);
    });
    router.replace(`${pathname}?${next.toString()}`);
  };

  const anyFilter =
    (qUrl && qUrl.length > 0) || status !== "" || owner !== "";

  return (
    <section
      className={[
        T.card,
        "grid gap-2",
        // компактная трёхколоночная сетка на sm, а на lg — исходная схема
        "sm:grid-cols-2",
        "lg:grid-cols-[1fr_180px_220px_auto] lg:items-end",
      ].join(" ")}
      role="region"
      aria-label="Фильтры заказов"
    >
      {/* Поиск */}
      <div className="relative">
        <label className="sr-only" htmlFor="orders-q">
          Поиск по заказам
        </label>
        <input
          id="orders-q"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          placeholder="№ заказа / клиент / email / телефон"
          className={[T.input, "pl-9 pr-8"].join(" ")}
          inputMode="search"
          aria-label="Поиск по заказам"
        />
        <Search
          width={16}
          height={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
          aria-hidden
        />
        {qInput ? (
          <button
            type="button"
            onClick={() => setQInput("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Очистить поиск"
            title="Очистить поиск"
          >
            <X width={14} height={14} />
          </button>
        ) : null}
      </div>

      {/* Статус */}
      <label className="grid gap-1">
        <span className="text-xs text-white/70">Статус</span>
        <select
          className={T.input}
          value={status}
          onChange={(e) => setParam("status", e.target.value || undefined)}
          aria-label="Статус заказа"
        >
          <option value="">Все</option>
          <option value="new">Новый</option>
          <option value="confirmed">Подтверждён</option>
          <option value="paid">Оплачен</option>
          <option value="completed">Выполнен</option>
          <option value="cancelled">Отменён</option>
          <option value="refunded">Возвращён</option>
        </select>
      </label>

      {/* Ответственный */}
      <label className="grid gap-1">
        <span className="text-xs text-white/70">Ответственный</span>
        <select
          className={T.input}
          value={owner}
          onChange={(e) => setParam("owner", e.target.value || undefined)}
          aria-label="Ответственный менеджер"
        >
          <option value="">Все</option>
          {MANAGERS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </label>

      {/* Кнопки: на мобиле в строку с переносом; на lg — справа */}
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="btn"
          onClick={reset}
          disabled={!anyFilter}
          aria-disabled={!anyFilter}
          title="Сбросить фильтры"
        >
          <X width={14} height={14} /> Сброс
        </button>
      </div>
    </section>
  );
}