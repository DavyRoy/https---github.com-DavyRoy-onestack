"use client";

import React from "react";
import { CreditCard, XCircle } from "lucide-react";

export default function TestPaymentPanel() {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3 flex items-center gap-2">
        <CreditCard className="w-4 h-4 opacity-70" />
        Симуляция платежа (демо)
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          onClick={() => alert("Симулирован успешный платёж")}
          className="flex-1 sm:flex-none rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium hover:bg-emerald-300 transition"
        >
          Simulate Paid
        </button>
        <button
          onClick={() => alert("Симулирован отказ")}
          className="flex-1 sm:flex-none rounded-lg border border-white/20 px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06] transition flex items-center justify-center gap-1"
        >
          <XCircle className="w-4 h-4" />
          Simulate Failed
        </button>
      </div>
    </section>
  );
}