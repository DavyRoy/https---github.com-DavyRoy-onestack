// app/demo/admin/payments/fees/new/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FeePlanNewPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [active, setActive] = React.useState(true);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [notes, setNotes] = React.useState("");

  // стабильная клиентская метка времени
  const [clientTime, setClientTime] = React.useState<string>("");
  React.useEffect(() => {
    const iso = new Date().toISOString().replace("T", " ").slice(0, 16); // YYYY-MM-DD hh:mm
    setClientTime(iso);
  }, []);

  const onCreate = () => {
    if (!name.trim()) {
      alert("Введите название плана");
      return;
    }
    alert(`План «${name.trim()}» создан (демо).`);
    router.push("/demo/admin/payments/fees");
  };

  const onCancel = () => router.push("/demo/admin/payments/fees");

  return (
    <div className="grid gap-6 overflow-x-hidden max-w-full">
      {/* Хедер */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/payments/fees" className="hover:underline">
              ← Тарифы/Комиссии
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight break-words">
            Новый план комиссий
          </h1>
          <p className="mt-1 text-sm text-white/60 break-words">
            Создайте шаблон правил комиссий. В демо данные не сохраняются.
          </p>
        </div>

        {/* Кнопки: на мобиле — колонкой на всю ширину */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={onCreate}
            className="w-full sm:w-auto rounded-lg bg-white/90 text-black px-3 py-2 text-sm hover:bg-white"
          >
            Создать план
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Отмена
          </button>
        </div>
      </header>

      {/* Форма параметров плана */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
        <div className="grid gap-3 md:grid-cols-2 min-w-0">
          <div className="grid gap-2 min-w-0">
            <label className="text-sm text-white/70">Название плана</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Напр., «Q4 Promo 2025»"
              className="w-full min-w-0 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70">Статус</label>
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 accent-white"
              />
              <label htmlFor="active" className="text-sm">
                Активен
              </label>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70">Дата начала</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70">Дата окончания</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          <div className="md:col-span-2 grid gap-2 min-w-0">
            <label className="text-sm text-white/70">Заметки</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Кратко опишите назначение плана, исключения и пр."
              className="w-full min-w-0 rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </section>

      {/* Заглушка редактора правил */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
        <div className="text-sm text-white/70 mb-2">Правила комиссий (демо)</div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70 break-words">
          Конструктор правил не подключён в демо. После «Создать план» вы вернётесь к списку.
        </div>
      </section>

      {/* Полоса аудита (демо, без гидрации) */}
      <div className="text-xs text-white/50 break-words whitespace-normal">
        Будет создано демо-действие: пользователь{" "}
        <span className="break-all">admin@example.com</span> •{" "}
        <span suppressHydrationWarning className="break-words">
          {clientTime || "—"}
        </span>
      </div>
    </div>
  );
}