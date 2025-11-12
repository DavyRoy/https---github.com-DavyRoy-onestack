// src/app/demo/manager/payments/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileDown, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import PaymentsFiltersBar from "./components/PaymentsFiltersBar";
import PaymentsTable from "./components/PaymentsTable";
import { loadPayments } from "./data/storage";
import type { Payment } from "./data/mockPayments";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
  btn: "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
  dim: "text-white/70",
};

export default function PaymentsPage() {
  const sp = useSearchParams();

  // Клиентский монтаж и загрузка списка (чтобы не было SSR-глитчей)
  const [mounted, setMounted] = useState(false);
  const [rows, setRows] = useState<Payment[] | null>(null);

  useEffect(() => {
    setMounted(true);
    setRows(loadPayments());
  }, []);

  // Вытаскиваем параметры из URL (строки — безопасны в зависимостях)
  const qParam = (sp.get("q") || "").trim().toLowerCase();
  const sortParam =
    (sp.get("sort") as "createdAt_desc" | "createdAt_asc" | "amount_desc" | "amount_asc") ||
    "createdAt_desc";

  // Фильтрация/сортировка — только после загрузки
  const filtered = useMemo(() => {
    if (!rows) return [];

    const base = qParam
      ? rows.filter((p) => {
          const id = p.id.toLowerCase();
          const order = (p.orderId || "").toLowerCase();
          const client = (p.client || "").toLowerCase();
          const email = (p.email || "").toLowerCase();
          return (
            id.includes(qParam) ||
            order.includes(qParam) ||
            client.includes(qParam) ||
            email.includes(qParam)
          );
        })
      : rows.slice();

    base.sort((a, b) => {
      switch (sortParam) {
        case "createdAt_asc":
          return a.createdAt.localeCompare(b.createdAt);
        case "amount_desc":
          return b.amount - a.amount;
        case "amount_asc":
          return a.amount - b.amount;
        case "createdAt_desc":
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });

    return base;
  }, [rows, qParam, sortParam]);

  const exportCSV = () => {
    toast.success("CSV сформирован (демо)");
  };

  return (
    <div className={T.page}>
      {/* Хедер */}
      <header className={T.hero}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Платежи</h1>
            <p className={"mt-1 text-sm " + T.dim}>Транзакции, статусы и связанные заказы</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/demo/manager/payments/new-invoice" className={T.btn} aria-label="Выставить счёт">
              <PlusCircle width={16} height={16} /> Выставить счёт
            </Link>
            <button className={T.btn} onClick={exportCSV} aria-label="Экспортировать CSV">
              <FileDown width={16} height={16} /> Экспорт CSV (демо)
            </button>
          </div>
        </div>
      </header>

      {/* Фильтры */}
      <section className={T.card} aria-label="Фильтры платежей">
        <PaymentsFiltersBar />
      </section>

      {/* Таблица / пустое состояние / скелет */}
      <section className={T.card} aria-live="polite">
        {!mounted || rows === null ? (
          <div className="grid gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm opacity-80">
            Платежей не найдено. Измените фильтры или создайте счёт.
          </div>
        ) : (
          <PaymentsTable rows={filtered} />
        )}
      </section>
    </div>
  );
}