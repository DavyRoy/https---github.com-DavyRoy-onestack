"use client";

import Link from "next/link";
import MethodBadge from "./MethodBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { Payment } from "../data/mockPayments";

export default function PaymentRow({ p }: { p: Payment }) {
  const fmt = (n: number, c: string) => `${n.toLocaleString("ru-RU")} ${c}`;
  const short = p.id.replace("P-2025", "P-25");

  return (
    <>
      {/* 💻 Десктопная версия */}
      <tr
        className="hidden md:table-row hover:bg-white/5 transition-colors"
        aria-label={`Платёж ${p.id}, сумма ${p.amount} ${p.currency}`}
      >
        <td className="px-3 py-2">
          <Link
            href={`/demo/manager/payments/${p.id}`}
            className="underline decoration-dotted hover:decoration-solid"
          >
            {short}
          </Link>
        </td>

        <td className="px-3 py-2 text-sm opacity-80 whitespace-nowrap">
          {new Date(p.createdAt).toLocaleString("ru-RU")}
        </td>

        <td className="px-3 py-2 text-sm">
          <div className="truncate max-w-[160px]">{p.client}</div>
          {p.email && (
            <div className="text-[11px] opacity-60 truncate max-w-[160px]">
              {p.email}
            </div>
          )}
        </td>

        <td className="px-3 py-2 text-sm">
          {p.orderId ? (
            <Link
              href={`/demo/manager/orders/${p.orderId}`}
              className="underline decoration-dotted hover:decoration-solid"
            >
              {p.orderId}
            </Link>
          ) : (
            <span className="opacity-60">—</span>
          )}
        </td>

        <td className="px-3 py-2 text-sm tabular-nums text-right">
          {fmt(p.amount, p.currency)}
        </td>

        <td className="px-3 py-2 text-center">
          <MethodBadge method={p.method} />
        </td>

        <td className="px-3 py-2 text-center">
          <PaymentStatusBadge status={p.status} />
        </td>

        <td className="px-3 py-2 text-sm opacity-70">{p.channel}</td>
      </tr>

      {/* 📱 Мобильная карточка */}
      <tr className="md:hidden border-t border-white/10">
        <td colSpan={8} className="p-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <Link
                href={`/demo/manager/payments/${p.id}`}
                className="font-medium underline decoration-dotted hover:decoration-solid"
              >
                {short}
              </Link>
              <PaymentStatusBadge status={p.status} />
            </div>

            <div className="text-sm opacity-80">
              {p.client}
              {p.email && (
                <div className="text-[11px] opacity-60 truncate">{p.email}</div>
              )}
            </div>

            <div className="flex justify-between text-xs text-white/60">
              <span>{new Date(p.createdAt).toLocaleDateString("ru-RU")}</span>
              <span>{p.channel}</span>
            </div>

            <div className="flex flex-wrap justify-between items-center mt-1 text-sm">
              <span className="tabular-nums font-medium">
                {fmt(p.amount, p.currency)}
              </span>
              <MethodBadge method={p.method} />
            </div>

            {p.orderId && (
              <Link
                href={`/demo/manager/orders/${p.orderId}`}
                className="text-xs underline opacity-80 hover:opacity-100"
              >
                Заказ: {p.orderId}
              </Link>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}