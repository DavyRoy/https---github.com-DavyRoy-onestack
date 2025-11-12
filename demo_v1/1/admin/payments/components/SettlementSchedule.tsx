"use client";

import React from "react";
import { Clock4, RefreshCcw } from "lucide-react";

export default function SettlementSchedule() {
  const items = [
    { id: "s1", title: "DemoPay", cadence: "D+2", last: "2025-10-06 18:20" },
    { id: "s2", title: "AltPay", cadence: "D+3", last: "2025-10-05 17:00" },
  ];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
        <Clock4 className="w-4 h-4 opacity-70" />
        Выплаты
      </div>

      <div className="grid gap-3">
        {items.map((i) => (
          <div
            key={i.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition"
          >
            <div>
              <div className="text-white font-medium">{i.title}</div>
              <div className="text-xs text-white/60 mt-0.5">
                Каденс: {i.cadence}
              </div>
            </div>
            <div className="text-sm text-white/70">
              Последняя: <span className="text-white">{i.last}</span>
            </div>
          </div>
        ))}

        <button
          onClick={() => alert("Обновление данных (демо)")}
          className="mt-2 flex items-center gap-2 rounded-lg bg-white/90 text-black px-3 py-2 text-sm w-full sm:w-max hover:bg-white transition"
        >
          <RefreshCcw className="w-4 h-4" />
          Обновить данные
        </button>
      </div>
    </section>
  );
}