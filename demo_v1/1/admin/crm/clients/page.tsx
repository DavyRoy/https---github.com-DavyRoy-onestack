"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClientsFiltersBar from "../components/ClientsFiltersBar";
import ClientsTable from "../components/ClientsTable";

export default function AdminCrmClientsPage() {
  const sp = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Читаем q только после маунта, чтобы избежать рассинхрона SSR/CSR
  const q = mounted ? sp.get("q") ?? "" : "";

  if (!mounted) {
    // Небольшой скелетон, чтобы не мигало на мобильных
    return (
      <div className="grid gap-6">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Клиенты</h1>
            <p className="text-white/60 text-sm mt-1">Справочник клиентов (админ).</p>
          </div>
        </header>

        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
          <div className="h-9 w-full rounded-lg bg-white/10 animate-pulse" />
        </section>

        <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
          <div className="h-7 w-1/3 rounded bg-white/10 animate-pulse mb-3" />
          <div className="h-40 rounded bg-white/10 animate-pulse" />
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Клиенты</h1>
          <p className="text-white/60 text-sm mt-1">Справочник клиентов (админ).</p>
        </div>
      </header>

      <ClientsFiltersBar />
      <ClientsTable filterQ={q} />
    </div>
  );
}