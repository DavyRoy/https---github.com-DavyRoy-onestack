// app/demo/admin/payments/components/TestPaymentPanel.tsx
"use client";

import * as React from "react";
import { CreditCard, XCircle, CheckCircle2 } from "lucide-react";

export default function TestPaymentPanel() {
  const simulate = (status: "paid" | "failed") => {
    if (status === "paid") {
      alert("✅ Симулирован успешный платёж (демо)");
    } else {
      alert("❌ Симулирован отказ (демо)");
    }
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5"
      aria-labelledby="test-payment-header"
    >
      {/* Заголовок */}
      <div
        id="test-payment-header"
        className="text-sm text-white/70 mb-3 flex items-center gap-2 font-medium"
      >
        <CreditCard className="w-4 h-4 opacity-70" />
        Симуляция платежа (демо)
      </div>

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          type="button"
          onClick={() => simulate("paid")}
          className="flex-1 sm:flex-none rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium hover:bg-emerald-300 focus:ring-2 focus:ring-emerald-300/50 transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          Успешный платёж
        </button>

        <button
          type="button"
          onClick={() => simulate("failed")}
          className="flex-1 sm:flex-none rounded-lg border border-white/20 px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06] focus:ring-2 focus:ring-white/30 transition flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4 text-rose-400" />
          Ошибка платежа
        </button>
      </div>

      {/* Подсказка */}
      <p className="text-xs text-white/50 mt-3">
        💡 Используйте для тестирования интеграции платёжных событий без реальных транзакций.
      </p>
    </section>
  );
}