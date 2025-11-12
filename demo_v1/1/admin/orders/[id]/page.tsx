"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ADMIN_ORDERS } from "@/app/demo/admin/orders/data/mockAdminOrders";
import AdminOrderHeader from "../components/AdminOrderHeader";
import AdminOrderSummary from "../components/AdminOrderSummary";
import AdminOrderAudit from "../components/AdminOrderAudit";

function coerceId(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw;
  if (Array.isArray(raw) && raw[0]) return String(raw[0]);
  return null;
}

export default function AdminOrderDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();
  const id = coerceId(params?.id);

  const order = useMemo(
    () => (id ? ADMIN_ORDERS.find((o) => o.id === id) : undefined),
    [id]
  );

  if (!id) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Некорректный идентификатор</h1>
          <Link
            href="/demo/admin/orders"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70">
          Проверьте ссылку или вернитесь к списку заказов.
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Заказ не найден</h1>
          <Link
            href="/demo/admin/orders"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70">
          Возможно, он был удалён или ID указан неверно.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 overflow-x-hidden">
      {/* Крошки */}
      <nav className="text-xs text-white/60">
        <Link href="/demo/admin/orders" className="hover:underline break-words">Заказы</Link>
        <span className="mx-1">/</span>
        <span className="text-white/80 break-all">{order.id}</span>
      </nav>

      {/* Хедер как отдельная карточка */}
      <div className="min-w-0">
        <AdminOrderHeader order={order} />
      </div>

      {/* Контент */}
      <div className="grid gap-3 md:grid-cols-3 min-w-0">
        <div className="md:col-span-2 grid gap-3 min-w-0">
          <AdminOrderSummary order={order} />
          <AdminOrderAudit order={order} />
        </div>

        <aside className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
          <div className="text-sm font-medium">Контексты</div>
          <div className="mt-2 grid gap-2 text-sm">
            <Link
              href={`/demo/manager/orders/${order.id}`}
              className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/15 break-words"
            >
              Открыть в интерфейсе менеджера
            </Link>
            <Link
              href={`/demo/manager/crm/clients/${order.clientId}`}
              className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/15 break-words"
            >
              Клиент в CRM
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}