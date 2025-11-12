"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { T } from "@/app/demo/manager/_parts/tokens";
import {
  mockOrders,
  type Order,
  MANAGERS,
} from "@/app/demo/manager/orders/data/mockOrders";
import OrderStatusBadge from "@/app/demo/manager/orders/components/OrderStatusBadge";
import OrderAmount from "@/app/demo/manager/orders/components/OrderAmount";
import OrderPaymentPanel, {
  type PaymentEvent,
} from "@/app/demo/manager/orders/components/OrderPaymentPanel";
import OrderTimeline, {
  type TimelineItem,
} from "@/app/demo/manager/orders/components/OrderTimeline";
import OrderAssigneeSelect from "@/app/demo/manager/orders/components/OrderAssigneeSelect";

export default function OrderViewPage() {
  const { id } = useParams<{ id: string }>();

  // Синхронно находим заказ в моках (без useEffect)
  const order = useMemo(() => mockOrders.find((o) => o.id === id) || null, [id]);

  // Если не нашли — мягкое пустое состояние (без notFound())
  if (!order) {
    return (
      <div className="grid gap-6">
        <header className={T.hero}>
          <nav
            className="flex items-center gap-1 text-xs text-white/70"
            aria-label="Хлебные крошки"
          >
            <Link
              href="/demo/manager/dashboard"
              prefetch={false}
              className="inline-flex items-center gap-1 hover:underline"
            >
              <Home width={14} height={14} /> Дашборд
            </Link>
            <span className="opacity-40" aria-hidden>
              /
            </span>
            <Link href="/demo/manager/orders" prefetch={false} className="hover:underline">
              Заказы
            </Link>
            <span className="opacity-40" aria-hidden>
              /
            </span>
            <span className="text-white/80" aria-current="page">
              Заказ не найден
            </span>
          </nav>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Заказ не найден
          </h1>
          <p className={"mt-1 text-sm " + T.dim}>
            Проверьте номер заказа или вернитесь к списку.
          </p>
        </header>
      </div>
    );
  }

  // Локальные состояния (демо): статус, ответственный, платежи и таймлайн
  const [status, setStatus] = useState<Order["status"]>(order.status);
  const [owner, setOwner] = useState<string | null>(order.owner ?? null);
  const [payments, setPayments] = useState<PaymentEvent[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([
    {
      id: "t1",
      time: order.createdAt,
      text: `Заказ создан, статус: ${mapStatus(order.status)}`,
    },
  ]);

  const createdAtFmt = useMemo(
    () => new Date(order.createdAt).toLocaleString("ru-RU"),
    [order.createdAt]
  );

  const pushTimeline = (text: string) =>
    setTimeline((s) => [
      ...s,
      { id: "t" + (s.length + 1), time: new Date().toISOString(), text },
    ]);

  const setStatusAndLog = (s: Order["status"]) => {
    setStatus(s);
    pushTimeline(`Статус изменён на «${mapStatus(s)}»`);
  };

  // ----- Actions (демо)
  const onConfirm = () => {
    if (status !== "new") return;
    setStatusAndLog("confirmed");
    toast.success("Подтверждено");
  };
  const onMarkPaid = () => {
    if (status !== "confirmed") return;
    setStatusAndLog("paid");
    setPayments((p) => [
      ...p,
      {
        id: "p" + (p.length + 1),
        type: "pay",
        time: new Date().toISOString(),
        amount: order.amount,
        note: "Оплата картой (демо)",
      },
    ]);
    toast.success("Оплата отмечена");
  };
  const onComplete = () => {
    if (status !== "paid") return;
    setStatusAndLog("completed");
    toast.success("Завершён");
  };
  const onCancel = () => {
    if (!(status === "new" || status === "confirmed")) return;
    setStatusAndLog("cancelled");
    toast.success("Отменён");
  };

  const onPayDemo = onMarkPaid;
  const onRefundDemo = () => {
    if (status !== "paid") return;
    setStatusAndLog("refunded");
    setPayments((p) => [
      ...p,
      {
        id: "p" + (p.length + 1),
        type: "refund",
        time: new Date().toISOString(),
        amount: order.amount,
        note: "Возврат (демо)",
      },
    ]);
    toast.success("Возврат проведён (демо)");
  };
  const onSendInvoiceDemo = () => {
    setPayments((p) => [
      ...p,
      {
        id: "p" + (p.length + 1),
        type: "invoice",
        time: new Date().toISOString(),
        note: "Счёт отправлен клиенту (демо)",
      },
    ]);
    pushTimeline("Отправлен счёт клиенту (демо)");
    toast.message("Счёт отправлен (демо)");
  };

  // назначение ответственного (демо)
  const onAssign = (managerId: string | null) => {
    setOwner(managerId);
    const picked = MANAGERS.find((m) => m.id === managerId)?.name || "Не назначен";
    pushTimeline(`Ответственный: ${picked}`);
    toast.success("Ответственный обновлён (демо)");
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className={T.hero}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav
              className="flex items-center gap-1 text-xs text-white/70"
              aria-label="Хлебные крошки"
            >
              <Link
                href="/demo/manager/dashboard"
                prefetch={false}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Home width={14} height={14} /> Дашборд
              </Link>
              <span className="opacity-40" aria-hidden>
                /
              </span>
              <Link href="/demo/manager/orders" prefetch={false} className="hover:underline">
                Заказы
              </Link>
              <span className="opacity-40" aria-hidden>
                /
              </span>
              <span className="text-white/80" aria-current="page">
                {order.id}
              </span>
            </nav>

            <div className="mt-2 flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Заказ {order.id}
              </h1>
              {/* Статус — виден и на мобиле */}
              <span className="md:hidden inline-block align-middle">
                <OrderStatusBadge status={status} />
              </span>
            </div>

            <p className={"mt-1 text-sm " + T.dim}>
              {createdAtFmt} • Канал: {order.channel} • Ответственный:{" "}
              {owner ? MANAGERS.find((m) => m.id === owner)?.name || "—" : "—"}
            </p>
          </div>

          {/* Десктопный бейдж статуса */}
          <div className="hidden md:flex items-center gap-2">
            <OrderStatusBadge status={status} />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        {/* Left column */}
        <section
          className={T.card + " grid gap-3"}
          aria-labelledby="order-items-title"
        >
          <h2 id="order-items-title" className="text-base font-semibold">
            Состав
          </h2>

          <div className="grid gap-1">
            {order.items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between text-sm"
                aria-label={`${it.title}, количество ${it.qty}`}
              >
                <div className="min-w-0 truncate">
                  {it.title} <span className="text-white/60">× {it.qty}</span>
                </div>
                <div className="tabular-nums">
                  {(it.price * it.qty).toLocaleString("ru-RU")} ₽
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm">Итого</div>
            <div className="text-lg font-semibold">
              <OrderAmount value={order.amount} />
            </div>
          </div>

          {/* Статусные действия: на мобиле тянутся на всю ширину */}
          <div className="mt-2 grid gap-2 sm:flex sm:flex-wrap">
            <button
              className="btn w-full sm:w-auto"
              onClick={onConfirm}
              disabled={status !== "new"}
            >
              Подтвердить
            </button>
            <button
              className="btn w-full sm:w-auto"
              onClick={onMarkPaid}
              disabled={status !== "confirmed"}
            >
              Отметить оплату
            </button>
            <button
              className="btn w-full sm:w-auto"
              onClick={onComplete}
              disabled={status !== "paid"}
            >
              Завершить
            </button>
            <button
              className="btn w-full sm:w-auto"
              onClick={onCancel}
              disabled={!(status === "new" || status === "confirmed")}
            >
              Отменить
            </button>
          </div>
        </section>

        {/* Right column */}
        <div className="grid gap-4">
          <OrderPaymentPanel
            amount={order.amount}
            status={status}
            history={payments}
            onPay={onPayDemo}
            onRefund={onRefundDemo}
            onSendInvoice={onSendInvoiceDemo}
          />

          {/* Ответственный */}
          <section className={T.card + " grid gap-2"} aria-labelledby="assignee-title">
            <h2 id="assignee-title" className="text-base font-semibold">
              Ответственный
            </h2>
            <OrderAssigneeSelect value={owner} managers={MANAGERS} onChange={onAssign} />
          </section>

          {/* Клиент */}
          <section className={T.card} aria-labelledby="customer-title">
            <h2 id="customer-title" className="text-base font-semibold">
              Клиент
            </h2>
            <div className="mt-1 text-sm">{order.customer.name}</div>
            <div className="text-xs text-white/70">
              {order.customer.email || order.customer.phone || "—"}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href={`/demo/manager/crm/clients/${order.customer.id}`}
                prefetch={false}
                className="btn"
              >
                Открыть клиента
              </Link>
              <Link
                href={`/demo/manager/orders?client=${order.customer.id}`}
                prefetch={false}
                className="btn"
              >
                Все заказы клиента
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Timeline */}
      <OrderTimeline
        items={timeline}
        onAddNote={(text) => {
          pushTimeline(text);
          toast.success("Заметка добавлена");
        }}
      />
    </div>
  );
}

function mapStatus(s: Order["status"]) {
  switch (s) {
    case "new":
      return "Новый";
    case "confirmed":
      return "Подтверждён";
    case "paid":
      return "Оплачен";
    case "completed":
      return "Выполнен";
    case "cancelled":
      return "Отменён";
    case "refunded":
      return "Возвращён";
    default:
      return s;
  }
}