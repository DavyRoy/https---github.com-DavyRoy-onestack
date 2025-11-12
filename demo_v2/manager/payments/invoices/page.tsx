// src/app/demo/manager/payments/invoices/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Invoice } from "../data/mockPayments";
import InvoicesTable from "./components/InvoicesTable";
import InvoiceFiltersBar from "./components/InvoiceFiltersBar";
import { PlusCircle, Download, Calendar } from "lucide-react";
import { downloadCSV, downloadInvoicesICS, loadInvoices } from "../data/storage";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  btn: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15",
};

export default function InvoicesPage() {
  const sp = useSearchParams();
  const all = loadInvoices();

  const rows = useMemo(() => {
    let r: Invoice[] = [...all];

    const q = (sp.get("q") ?? "").trim().toLowerCase();
    const status = sp.get("status") ?? "";
    const sort = sp.get("sort") ?? "createdAt_desc";

    if (q) {
      r = r.filter(
        (x) =>
          x.id.toLowerCase().includes(q) ||
          x.client.toLowerCase().includes(q) ||
          (x.orderId && x.orderId.toLowerCase().includes(q))
      );
    }
    if (status) r = r.filter((x) => x.status === status);

    r.sort((a, b) => {
      switch (sort) {
        case "createdAt_asc":
          return a.createdAt.localeCompare(b.createdAt);
        case "dueAt_asc":
          return a.dueAt.localeCompare(b.dueAt);
        case "amount_desc":
          return b.total - a.total;
        case "amount_asc":
          return a.total - b.total;
        default:
          return b.createdAt.localeCompare(a.createdAt); // createdAt_desc
      }
    });

    return r;
  }, [sp, all]);

  const onExportCSV = () => {
    try {
      downloadCSV(
        "invoices.csv",
        rows.map((x) => ({
          id: x.id,
          createdAt: x.createdAt,
          dueAt: x.dueAt,
          client: x.client,
          orderId: x.orderId || "",
          total: x.total,
          currency: x.currency,
          status: x.status,
        })),
        ["id", "createdAt", "dueAt", "client", "orderId", "total", "currency", "status"]
      );
    } catch {
      // no-op (демо)
    }
  };

  const onExportICS = () => {
    try {
      downloadInvoicesICS("invoices-due.ics", rows);
    } catch {
      // no-op (демо)
    }
  };

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Счета</h1>
            <p className="mt-1 text-sm text-white/70">Выставленные счета и статусы</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/demo/manager/payments/new-invoice"
              className={T.btn}
              aria-label="Создать новый счёт"
            >
              <PlusCircle width={16} height={16} /> Новый счёт
            </Link>
            <button className={T.btn} onClick={onExportCSV} aria-label="Экспорт счетов в CSV">
              <Download width={16} height={16} /> Экспорт CSV
            </button>
            <button className={T.btn} onClick={onExportICS} aria-label="Экспорт сроков счетов в ICS">
              <Calendar width={16} height={16} /> Экспорт ICS (сроки)
            </button>
          </div>
        </div>

        <div className="mt-3">
          <InvoiceFiltersBar />
        </div>
      </header>

      <InvoicesTable rows={rows} />
    </div>
  );
}