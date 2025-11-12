"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Home, Plus, Download } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import OrdersFiltersBar from "@/app/demo/manager/orders/components/OrdersFiltersBar";
import OrdersTable from "@/app/demo/manager/orders/components/OrdersTable";
import EmptyState from "@/app/demo/manager/orders/components/EmptyState";
import ExportMenu from "@/app/demo/manager/orders/components/ExportMenu";
import { mockOrders, type Order } from "@/app/demo/manager/orders/data/mockOrders";

export default function OrdersPage() {
  const sp = useSearchParams();
  const [rows, setRows] = useState<Order[]>(mockOrders);

  // ---- Фильтрация (по URL-параметрам)
  const filtered = useMemo(() => {
    const q = (sp.get("q") || "").toLowerCase().trim();
    const status = sp.get("status") || "";
    const owner = sp.get("owner") || "";

    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (owner && (r.owner || "") !== owner) return false;
      if (!q) return true;
      const hay = [
        r.id,
        r.customer.name,
        r.customer.email || "",
        r.customer.phone || "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, sp]);

  return (
    <div className="grid gap-6">
      {/* Хедер */}
      <header className={T.hero} aria-labelledby="orders-title">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="flex items-center gap-1 text-xs text-white/70" aria-label="Хлебные крошки">
              <Link
                href="/demo/manager/dashboard"
                className="inline-flex items-center gap-1 hover:underline"
                prefetch={false}
              >
                <Home width={14} height={14} /> Дашборд
              </Link>
              <span className="opacity-40" aria-hidden>/</span>
              <span className="text-white/80" aria-current="page">Заказы</span>
            </nav>

            <div className="mt-2 flex items-center gap-2">
              <h1 id="orders-title" className="text-2xl md:text-3xl font-semibold tracking-tight">
                Заказы
              </h1>
              <span
                className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/80"
                aria-label={`Количество заказов: ${filtered.length}`}
              >
                {filtered.length}
              </span>
            </div>
          </div>

          {/* Десктопные действия */}
          <div className="hidden md:flex items-center gap-2">
            <ExportMenu fileName="orders-demo.csv">
              <button className="btn" aria-label="Экспортировать заказы в CSV">
                <Download width={16} height={16} /> Экспорт CSV
              </button>
            </ExportMenu>
            <Link href="/demo/manager/orders/new" className="btn btn-primary" prefetch={false}>
              <Plus width={16} height={16} /> Создать заказ
            </Link>
          </div>
        </div>

        {/* Фильтры */}
        <div className="mt-3">
          <OrdersFiltersBar />
        </div>

        {/* Дубли действий для мобилы */}
        <div className="mt-3 flex gap-2 md:hidden">
          <ExportMenu fileName="orders-demo.csv">
            <button className="btn w-[40%] min-h-[40px]">
              <Download width={16} height={16} /> Экспорт
            </button>
          </ExportMenu>
          <Link
            href="/demo/manager/orders/new"
            prefetch={false}
            className="btn btn-primary flex-1 min-h-[40px]"
          >
            <Plus width={16} height={16} /> Новый заказ
          </Link>
        </div>
      </header>

      {/* Таблица / пустое состояние */}
      <section className={T.card} aria-labelledby="orders-table-title">
        {filtered.length === 0 ? (
          <EmptyState
            title="Заказы не найдены"
            hint="Измените фильтры или создайте первый заказ."
            ctaPrimary={{ href: "/demo/manager/orders/new", label: "Создать заказ" }}
            ctaSecondary={{ href: "/demo/manager/crm/clients", label: "К клиентам", kind: "ghost" }}
          />
        ) : (
          <>
            <h2 id="orders-table-title" className="sr-only">Таблица заказов</h2>
            <OrdersTable rows={filtered} onChangeRows={setRows} />
          </>
        )}
      </section>
    </div>
  );
}