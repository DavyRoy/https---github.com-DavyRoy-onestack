// src/app/demo/manager/payments/invoices/components/InvoiceFiltersBar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const T = {
  wrap: "rounded-2xl border border-white/15 bg-white/[0.05] p-3 backdrop-blur-sm",
  input:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40",
  sel: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30",
  btn: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
};

export default function InvoiceFiltersBar() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [status, setStatus] = useState(sp.get("status") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "createdAt_desc");

  const apply = () => {
    const next = new URLSearchParams(sp.toString());
    const setParam = (k: string, v: string) =>
      v ? next.set(k, v) : next.delete(k);
    setParam("q", q.trim());
    setParam("status", status);
    setParam("sort", sort);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const reset = () => router.push(pathname, { scroll: false });

  return (
    <div className={T.wrap} role="region" aria-label="Фильтры счетов">
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
        <input
          className={T.input}
          placeholder="Поиск: счёт / клиент / заказ"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Поиск по номеру счёта, клиенту или заказу"
        />
        <select
          className={T.sel}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Фильтр по статусу счёта"
        >
          <option value="">Статус</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="viewed">Viewed</option>
          <option value="paid">Paid</option>
          <option value="void">Void</option>
        </select>
        <select
          className={T.sel}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Сортировка счетов"
        >
          <option value="createdAt_desc">Создан ↓</option>
          <option value="createdAt_asc">Создан ↑</option>
          <option value="dueAt_asc">Срок оплаты ↑</option>
          <option value="amount_desc">Сумма ↓</option>
          <option value="amount_asc">Сумма ↑</option>
        </select>
        <div className="flex gap-2">
          <button type="button" className={T.btn} onClick={reset}>
            Сброс
          </button>
          <button type="button" className={T.btn} onClick={apply}>
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}