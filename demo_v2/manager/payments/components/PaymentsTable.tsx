"use client";

import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import type { Payment } from "../data/mockPayments";
import PaymentStatusBadge from "./PaymentStatusBadge";
import MethodBadge from "./MethodBadge";

const T = {
  row:
    "grid grid-cols-[140px_170px_1fr_140px_120px_110px_60px] items-center gap-2 py-2 px-2 rounded-lg hover:bg-white/5",
  head: "text-[11px] uppercase tracking-wide opacity-60 px-2",
  card:
    "rounded-xl border border-white/12 bg-white/[0.04] p-3 flex flex-col gap-1 hover:border-white/20",
  cardLine: "flex items-center justify-between gap-2 text-sm",
  mut: "text-xs text-white/60",
};

function formatIso(iso: string) {
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
const fmt = (n: number) => n.toLocaleString("ru-RU");

export default function PaymentsTable({ rows }: { rows: Payment[] }) {
  return (
    <div className="w-full">
      {/* ===== Mobile / small screens: cards ===== */}
      <div className="grid gap-2 md:hidden">
        {rows.map((p) => (
          <Link key={p.id} href={`/demo/manager/payments/${p.id}`} className={T.card}>
            <div className={T.cardLine}>
              <div className="font-medium">
                {p.id}
              </div>
              <div className="flex items-center gap-2">
                <PaymentStatusBadge status={p.status} />
                <EllipsisVertical className="opacity-60" width={16} height={16} />
              </div>
            </div>

            <div className={T.cardLine}>
              <div className="tabular-nums">{fmt(p.amount)} {p.currency}</div>
              <MethodBadge method={p.method} />
            </div>

            <div className={T.mut}>{formatIso(p.createdAt)}</div>

            <div className="text-sm">
              <div className="truncate">{p.client || "—"}</div>
              {p.email && <div className="truncate text-xs opacity-70">{p.email}</div>}
            </div>

            <div className="text-sm">
              {p.orderId ? (
                <Link
                  href={`/demo/manager/orders/${p.orderId}`}
                  className="underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Заказ: {p.orderId}
                </Link>
              ) : (
                <span className="opacity-60">Без заказа</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* ===== Desktop / ≥ md: table-like grid ===== */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[140px_170px_1fr_140px_120px_110px_60px] gap-2 px-2 pb-2">
            <div className={T.head}>№ платежа</div>
            <div className={T.head}>Дата/время</div>
            <div className={T.head}>Клиент</div>
            <div className={T.head}>Заказ</div>
            <div className={T.head}>Сумма</div>
            <div className={T.head}>Метод</div>
            <div className={T.head}>Статус</div>
          </div>

          <div className="grid gap-1">
            {rows.map((p) => (
              <Link
                key={p.id}
                href={`/demo/manager/payments/${p.id}`}
                className={T.row}
                aria-label={`Платёж ${p.id}, сумма ${fmt(p.amount)} ${p.currency}`}
              >
                <div className="tabular-nums">{p.id}</div>
                <div className="opacity-80">{formatIso(p.createdAt)}</div>

                <div className="truncate">
                  <div className="truncate">{p.client || "—"}</div>
                  {p.email && (
                    <div className="text-xs opacity-60 truncate">{p.email}</div>
                  )}
                </div>

                <div className="tabular-nums">
                  {p.orderId ? (
                    <Link
                      href={`/demo/manager/orders/${p.orderId}`}
                      className="underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {p.orderId}
                    </Link>
                  ) : (
                    <span className="opacity-60">—</span>
                  )}
                </div>

                <div className="tabular-nums">
                  {fmt(p.amount)} {p.currency}
                </div>

                <div>
                  <MethodBadge method={p.method} />
                </div>

                <div className="flex items-center gap-2">
                  <PaymentStatusBadge status={p.status} />
                  <EllipsisVertical className="opacity-60" width={16} height={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}