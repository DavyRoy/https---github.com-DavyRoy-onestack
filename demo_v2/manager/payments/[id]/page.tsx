"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleSlash2, Link2 } from "lucide-react";
import { toast } from "sonner";

import type { Payment } from "../data/mockPayments";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import MethodBadge from "../components/MethodBadge";
import RefundPanel from "../components/RefundPanel";
import { loadPayments, loadInvoices, upsertPayment } from "../data/storage";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm",
  btn: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
  dim: "text-white/70",
};

function fmtIso(iso: string) {
  try {
    const d = new Date(iso);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
  } catch {
    return iso;
  }
}
const fmtAmount = (n: number, c: string) => `${n.toLocaleString("ru-RU")} ${c}`;

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();

  // загрузка демо-данных из localStorage
  const all = loadPayments();
  const initial = all.find((x) => x.id === id) as Payment | undefined;
  const [p, setP] = useState<Payment | null>(initial ?? null);

  const invoices = loadInvoices();

  const linkedInvoiceUrl = useMemo(() => {
    return p?.linkedInvoiceId
      ? `/demo/manager/payments/invoices/${p.linkedInvoiceId}`
      : null;
  }, [p]);

  if (!p) {
    return (
      <div className={T.page}>
        <header className={T.hero}>
          <Link
            href="/demo/manager/payments"
            className={T.btn}
            aria-label="Назад к списку платежей"
          >
            <ArrowLeft width={16} height={16} /> Назад
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Платёж не найден</h1>
          <p className={"mt-1 text-sm " + T.dim}>
            Проверьте ссылку или вернитесь к списку платежей.
          </p>
        </header>
      </div>
    );
  }

  const setStatus = (status: Payment["status"]) => {
    const next = { ...p, status } as Payment;
    setP(next);
    upsertPayment(next);
    toast.success(`Статус изменён: ${status}`);
  };

  const linkWithInvoice = () => {
    const inv = invoices[0];
    if (!inv) {
      toast.error("Нет счетов для привязки (демо)");
      return;
    }
    const next = { ...p, linkedInvoiceId: inv.id } as Payment;
    setP(next);
    upsertPayment(next);
    toast.success(`Платёж привязан к счёту ${inv.id}`);
  };

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/demo/manager/payments"
                className={T.btn}
                aria-label="Назад к платежам"
              >
                <ArrowLeft width={16} height={16} />
              </Link>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Платёж {p.id}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <PaymentStatusBadge status={p.status} />
              <MethodBadge method={p.method} />
              <span className="opacity-70">•</span>
              <span className="opacity-80">{fmtIso(p.createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(p.status === "authorized" || p.status === "captured") && (
              <button
                className={T.btn}
                onClick={() => setStatus("paid")}
                aria-label="Отметить платёж как оплачен"
              >
                <CheckCircle2 width={16} height={16} /> Оплачен
              </button>
            )}
            {(p.status === "authorized" || p.status === "captured") && (
              <button
                className={T.btn}
                onClick={() => setStatus("cancelled")}
                aria-label="Отменить платёж"
              >
                <CircleSlash2 width={16} height={16} /> Отменить
              </button>
            )}
            <button
              className={T.btn}
              onClick={linkWithInvoice}
              aria-label="Привязать платёж к счёту"
            >
              <Link2 width={16} height={16} /> Привязать к счёту
            </button>
          </div>
        </div>
      </header>

      <section className={T.card} aria-labelledby="summary-title">
        <div id="summary-title" className="text-base font-semibold">
          Сводка
        </div>
        <div className="mt-2 grid gap-1 text-sm">
          <div>
            Клиент: <span className="opacity-90">{p.client}</span>
          </div>
          <div>
            Заказ:{" "}
            {p.orderId ? (
              <Link
                className="underline"
                href={`/demo/manager/orders/${p.orderId}`}
              >
                {p.orderId}
              </Link>
            ) : (
              <span className="opacity-60">—</span>
            )}
          </div>
          <div>
            Сумма:{" "}
            <span className="tabular-nums">{fmtAmount(p.amount, p.currency)}</span>
          </div>
          <div>
            Канал: <span className="opacity-80">{p.channel}</span>
          </div>
          {p.fee ? (
            <div>
              Комиссия (демо):{" "}
              <span className="tabular-nums">
                {fmtAmount(p.fee, p.currency)}
              </span>
            </div>
          ) : null}
          <div>
            Связанный счёт:{" "}
            {linkedInvoiceUrl ? (
              <Link className="underline" href={linkedInvoiceUrl}>
                {p.linkedInvoiceId}
              </Link>
            ) : (
              <span className="opacity-60">—</span>
            )}
          </div>
        </div>
      </section>

      {p.status === "paid" && (
        <RefundPanel
          maxAmount={p.amount}
          currency={p.currency}
          onSubmit={(amount) => {
            const next = { ...p, status: "refunded" as const } as Payment;
            setP(next);
            upsertPayment(next);
            toast.success(
              `Возврат выполнен (демо) на ${amount.toLocaleString("ru-RU")} ${
                p.currency
              }`
            );
          }}
        />
      )}
    </div>
  );
}