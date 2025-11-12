// app/demo/admin/payments/components/AdminPaymentsHeader.tsx
"use client";

import * as React from "react";

type Props = {
  onChange?: (v: { range: string; location: string; currency: "RUB" | "KRW" | "USD" }) => void;
};

export default function AdminPaymentsHeader({ onChange }: Props) {
  const [range, setRange] = React.useState("30d");
  const [location, setLocation] = React.useState("all");
  const [currency, setCurrency] = React.useState<"RUB" | "KRW" | "USD">("RUB");

  // Отправляем изменения родителю
  React.useEffect(() => {
    onChange?.({ range, location, currency });
  }, [range, location, currency, onChange]);

  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      {/* Левая часть: заголовок и описание */}
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Платежи (админ)
        </h1>
        <p className="mt-1 text-sm text-white/70 max-w-[60ch]">
          Обзор платежных провайдеров, комиссий, трендов и алертов.
        </p>
      </div>

      {/* Правая часть: фильтры */}
      <form
        className="flex flex-wrap items-center gap-2 w-full md:w-auto"
        aria-label="Фильтры платежей"
      >
        <label className="flex-1 md:flex-none">
          <span className="sr-only">Период</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="today">Сегодня</option>
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
            <option value="qtr">Квартал</option>
            <option value="custom">Период</option>
          </select>
        </label>

        <label className="flex-1 md:flex-none">
          <span className="sr-only">Локация</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all">Все локации</option>
            <option value="center">Центр</option>
            <option value="south">Юг</option>
          </select>
        </label>

        <label className="flex-1 md:flex-none">
          <span className="sr-only">Валюта</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="RUB">₽ RUB</option>
            <option value="KRW">₩ KRW</option>
            <option value="USD">$ USD</option>
          </select>
        </label>
      </form>
    </header>
  );
}