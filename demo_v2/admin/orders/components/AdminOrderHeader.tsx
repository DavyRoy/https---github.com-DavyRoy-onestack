// app/demo/admin/orders/components/AdminOrderHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Lucide from "lucide-react";
import { AdminOrder } from "@/app/demo/admin/orders/data/mockAdminOrders";

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function statusTone(s: string) {
  const v = s.toLowerCase();
  if (["paid", "completed", "done", "shipped", "delivered", "success"].includes(v))
    return "bg-emerald-400/15 text-emerald-300";
  if (["processing", "in_progress", "pending", "new", "confirmed"].includes(v))
    return "bg-amber-400/15 text-amber-300";
  if (["canceled", "cancelled", "refunded", "failed"].includes(v))
    return "bg-rose-400/15 text-rose-300";
  return "bg-white/10 text-white/70";
}

function channelTone(s?: string) {
  const v = (s ?? "").toLowerCase();
  if (["online", "web"].includes(v)) return "bg-sky-400/15 text-sky-300";
  if (["manager", "pos", "offline"].includes(v)) return "bg-indigo-400/15 text-indigo-300";
  return "bg-white/10 text-white/70";
}

function fmtDate(iso?: string) {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Intl.DateTimeFormat("ru", { dateStyle: "medium", timeStyle: "short" }).format(t);
}

export default function AdminOrderHeader({ order }: { order: AdminOrder }) {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const copyId = async () => {
    const text = order.id ?? "";
    try {
      // надёжный фоллбек, если API буфера недоступен
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        alert("ID заказа скопирован");
      } else {
        window.prompt("Скопируйте ID вручную:", text);
      }
    } catch {
      window.prompt("Скопируйте ID вручную:", text);
    }
  };

  const createdLabel = fmtDate(order.createdAt ?? "");

  return (
    <header
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm"
      aria-labelledby="order-header-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <nav className="text-xs text-white/60 min-w-0" aria-label="Хлебные крошки">
            <Link href={`${base}/orders`} prefetch={false} className="hover:underline break-words">
              Заказы
            </Link>
            <span className="mx-1">/</span>
            <span className="text-white/80 break-all">#{order.id}</span>
          </nav>

          <h1
            id="order-header-title"
            className="mt-1 text-xl md:text-2xl font-semibold tracking-tight break-words"
          >
            Заказ #{order.id}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span className="truncate" title={order.createdAt ?? ""}>
              Создан: {createdLabel}
            </span>
            <span className="opacity-50">•</span>
            <span className={cls("rounded px-1.5 py-0.5", channelTone(order.channel))}>
              Канал: {order.channel ?? "—"}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <span
            className={cls(
              "rounded-xl px-2 py-1 text-xs tabular-nums capitalize",
              statusTone(order.status)
            )}
            title={`Статус: ${order.status}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={copyId}
          className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Скопировать ID заказа"
          title="Скопировать ID"
        >
          <Lucide.Copy className="h-4 w-4 opacity-80" />
          Копировать ID
        </button>

        <Link
          href={`${base}/orders/${order.id}/invoice`}
          prefetch={false}
          className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Счёт"
          title="Счёт"
        >
          <Lucide.Receipt className="h-4 w-4 opacity-80" />
          Счёт
        </Link>

        <Link
          href={`${base}/orders/${order.id}/invoice?print=1`}
          prefetch={false}
          className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Печать счёта"
          title="Печать счёта"
        >
          <Lucide.Printer className="h-4 w-4 opacity-80" />
          Печать
        </Link>

        {order.email && (
          <a
            href={`mailto:${order.email}?subject=${encodeURIComponent(`Заказ #${order.id}`)}`}
            className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Написать клиенту"
            title="Написать клиенту"
          >
            <Lucide.Mail className="h-4 w-4 opacity-80" />
            Клиент
          </a>
        )}

        {order.phone && (
          <a
            href={`tel:${order.phone}`}
            className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Позвонить клиенту"
            title="Позвонить клиенту"
          >
            <Lucide.Phone className="h-4 w-4 opacity-80" />
            Позвонить
          </a>
        )}
      </div>
    </header>
  );
}