"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";

const T = {
  wrap:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
  input:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40 w-full",
  sel:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 w-full",
  btn:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
};

export default function PaymentsFiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // локальные стейты, инициализируем из URL
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [status, setStatus] = useState(sp.get("status") ?? "");
  const [method, setMethod] = useState(sp.get("method") ?? "");
  const [channel, setChannel] = useState(sp.get("channel") ?? "");
  const [currency, setCurrency] = useState(sp.get("currency") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "createdAt_desc");

  // если URL меняется извне (например, назад/вперёд) — подтянем значения
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setStatus(sp.get("status") ?? "");
    setMethod(sp.get("method") ?? "");
    setChannel(sp.get("channel") ?? "");
    setCurrency(sp.get("currency") ?? "");
    setSort(sp.get("sort") ?? "createdAt_desc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp.toString()]);

  const pushParams = useCallback(
    (nextParams: URLSearchParams) => {
      nextParams.delete("page"); // сбросить пагинацию
      router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  const apply = useCallback(() => {
    const next = new URLSearchParams(sp.toString());
    const set = (k: string, v: string) => (v ? next.set(k, v) : next.delete(k));
    set("q", q.trim());
    set("status", status);
    set("method", method);
    set("channel", channel);
    set("currency", currency);
    set("sort", sort);
    pushParams(next);
  }, [sp, q, status, method, channel, currency, sort, pushParams]);

  const reset = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const quickChips = useMemo(
    () => [
      { label: "Сегодня", key: "today", on: sp.get("date") === "today" },
      {
        label: "Только онлайн",
        key: "online",
        on: sp.get("channel") === "online",
      },
      {
        label: "Не оплаченные",
        key: "auth/cap",
        on:
          sp.get("status") === "authorized" || sp.get("status") === "captured",
      },
    ],
    [sp]
  );

  const toggleChip = (chip: string) => {
    const next = new URLSearchParams(sp.toString());
    if (chip === "today") {
      if (next.get("date") === "today") next.delete("date");
      else next.set("date", "today");
    } else if (chip === "online") {
      if (next.get("channel") === "online") next.delete("channel");
      else next.set("channel", "online");
    } else if (chip === "auth/cap") {
      if (
        next.get("status") === "authorized" ||
        next.get("status") === "captured"
      ) {
        next.delete("status");
      } else {
        next.set("status", "authorized");
      }
    }
    pushParams(next);
  };

  return (
    <div className={T.wrap}>
      {/* Сетка ввода: 1 колонка на мобилке, расширяем на экранах */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <input
          className={T.input}
          placeholder="Поиск: платёж / заказ / клиент / e-mail / телефон"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          aria-label="Поиск по платежам"
        />

        <select
          className={T.sel}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Статус платежа"
        >
          <option value="">Статус</option>
          <option value="authorized">Authorized</option>
          <option value="captured">Captured</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className={T.sel}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          aria-label="Метод оплаты"
        >
          <option value="">Метод</option>
          <option value="card">Card</option>
          <option value="invoice">Invoice</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
        </select>

        <select
          className={T.sel}
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          aria-label="Канал"
        >
          <option value="">Канал</option>
          <option value="online">Online</option>
          <option value="manager">Manager</option>
        </select>

        <select
          className={T.sel}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          aria-label="Валюта"
        >
          <option value="">Валюта</option>
          <option value="RUB">RUB</option>
          <option value="USD">USD</option>
          <option value="KRW">KRW</option>
        </select>

        <select
          className={T.sel}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Сортировка"
        >
          <option value="createdAt_desc">Дата ↓</option>
          <option value="createdAt_asc">Дата ↑</option>
          <option value="amount_desc">Сумма ↓</option>
          <option value="amount_asc">Сумма ↑</option>
        </select>
      </div>

      {/* Быстрые чипы + действия */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {quickChips.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => toggleChip(c.key)}
            role="switch"
            aria-checked={c.on}
            className={[
              "rounded-full border px-2 py-1 text-xs transition-colors",
              c.on
                ? "border-white bg-white text-black"
                : "border-white/15 bg-white/10 hover:bg-white/15",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}

        <div className="ml-auto flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            className={T.btn + " flex-1 sm:flex-none"}
            onClick={reset}
          >
            Сброс
          </button>
          <button
            type="button"
            className={T.btn + " flex-1 sm:flex-none"}
            onClick={apply}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}