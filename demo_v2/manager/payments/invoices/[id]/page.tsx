// src/app/demo/manager/payments/invoices/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Invoice } from "../../data/mockPayments";
import InvoiceStatusBadge from "../components/InvoiceStatusBadge";
import { ArrowLeft, CheckCircle2, Send, Ban, FileDown, Link2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  loadInvoices,
  upsertInvoice,
  createPaymentFromInvoice,
  findPaymentByLinkedInvoiceId,
} from "../../data/storage";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm",
  btn: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
  dim: "text-white/70",
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const arr = loadInvoices();
  const initial = arr.find((x) => x.id === id) as Invoice | undefined;
  const [inv, setInv] = useState<Invoice | null>(initial ?? null);

  const linkedPayment = useMemo(
    () => (inv ? findPaymentByLinkedInvoiceId(inv.id) : undefined),
    [inv]
  );

  if (!inv) {
    return (
      <div className={T.page}>
        <header className={T.hero}>
          <Link href="/demo/manager/payments/invoices" className={T.btn} aria-label="Назад к списку счетов">
            <ArrowLeft width={16} height={16} /> Назад
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">Счёт не найден</h1>
        </header>
      </div>
    );
  }

  const setStatus = (status: Invoice["status"]) => {
    const next = { ...inv, status } as Invoice;
    setInv(next);
    upsertInvoice(next);
    toast.success(`Статус счета: ${status}`);

    // Если пометили оплаченным — создать платёж (если ещё нет)
    if (status === "paid") {
      const existed = findPaymentByLinkedInvoiceId(inv.id);
      if (!existed) {
        const p = createPaymentFromInvoice(next, { status: "paid" });
        toast.success(`Создан платёж ${p.id} (демо)`);
      }
    }
  };

  const createPaymentManually = () => {
    const existed = findPaymentByLinkedInvoiceId(inv.id);
    if (existed) {
      toast.info(`Уже связан платёж ${existed.id}`);
      return;
    }
    const p = createPaymentFromInvoice(inv, {
      status: inv.status === "paid" ? "paid" : "captured",
    });
    toast.success(
      `Создан платёж ${p.id} (статус: ${p.status}). Можно открыть его в «Платежах».`
    );
  };

  const fmt = (n: number) => n.toLocaleString("ru-RU");

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/demo/manager/payments/invoices"
                className={T.btn}
                aria-label="Назад"
              >
                <ArrowLeft width={16} height={16} />
              </Link>
              <h1 className="text-2xl md:text-3xl font-semibold">
                Счёт {inv.id}
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <InvoiceStatusBadge status={inv.status} />
              <span className="opacity-70">•</span>
              <span className="opacity-80">
                Создан: {new Date(inv.createdAt).toLocaleString("ru-RU")} • Срок:{" "}
                {new Date(inv.dueAt).toLocaleDateString("ru-RU")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={T.btn}
              onClick={() => {
                try {
                  alert("PDF сформирован (демо)");
                } catch {
                  /* no-op */
                }
              }}
              aria-label="Скачать PDF счета"
            >
              <FileDown width={16} height={16} /> Скачать PDF
            </button>

            {/* Отправить (draft->sent) */}
            {inv.status === "draft" && (
              <button className={T.btn} onClick={() => setStatus("sent")} aria-label="Отправить счёт">
                <Send width={16} height={16} /> Отправить
              </button>
            )}

            {/* Аннулировать (draft/sent/viewed) */}
            {(inv.status === "draft" ||
              inv.status === "sent" ||
              inv.status === "viewed") && (
              <button className={T.btn} onClick={() => setStatus("void")} aria-label="Аннулировать счёт">
                <Ban width={16} height={16} /> Аннулировать
              </button>
            )}

            {/* Отметить оплаченным (sent/viewed) */}
            {(inv.status === "sent" || inv.status === "viewed") && (
              <button className={T.btn} onClick={() => setStatus("paid")} aria-label="Отметить счёт оплаченным">
                <CheckCircle2 width={16} height={16} /> Отметить оплаченным
              </button>
            )}

            {/* Создать платёж вручную (если ещё нет) */}
            <button className={T.btn} onClick={createPaymentManually} aria-label="Создать платёж по счёту">
              <Link2 width={16} height={16} /> Создать платёж (демо)
            </button>
          </div>
        </div>
      </header>

      <section className={T.card}>
        <div className="text-base font-semibold">Позиции и итог</div>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-[500px] w-full text-sm">
            <thead className="text-xs opacity-70">
              <tr>
                <th className="px-3 py-2 text-left">Наименование</th>
                <th className="px-3 py-2 text-right">Кол-во</th>
                <th className="px-3 py-2 text-right">Цена</th>
                <th className="px-3 py-2 text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {inv.items.map((it) => (
                <tr key={it.id} className="hover:bg-white/5">
                  <td className="px-3 py-2">{it.title}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {it.qty}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {fmt(it.price)} {inv.currency}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {fmt(it.price * it.qty)} {inv.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm opacity-80">Итого</div>
          <div className="text-lg font-semibold tabular-nums">
            {fmt(inv.total)} {inv.currency}
          </div>
        </div>
      </section>

      <section className={T.card}>
        <div className="text-base font-semibold">Связи</div>
        <div className="mt-2 text-sm">
          <div>
            Заказ:{" "}
            {inv.orderId ? (
              <Link
                className="underline"
                href={`/demo/manager/orders/${encodeURIComponent(inv.orderId)}`}
              >
                {inv.orderId}
              </Link>
            ) : (
              <span className={T.dim}>—</span>
            )}
          </div>
          <div className="mt-1">
            Связанный платёж:{" "}
            {linkedPayment ? (
              <Link
                className="underline"
                href={`/demo/manager/payments/${encodeURIComponent(linkedPayment.id)}`}
              >
                {linkedPayment.id}
              </Link>
            ) : (
              <span className={T.dim}>—</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}