// app/demo/admin/payments/components/SettlementSchedule.tsx
"use client";

import * as React from "react";
import { Clock4, RefreshCcw, CalendarDays } from "lucide-react";

export default function SettlementSchedule() {
  const [items, setItems] = React.useState([
    { id: "s1", title: "DemoPay", cadence: "D+2", last: "2025-10-06 18:20" },
    { id: "s2", title: "AltPay", cadence: "D+3", last: "2025-10-05 17:00" },
  ]);

  const handleRefresh = () => {
    alert("Обновление данных (демо)");
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5"
      aria-labelledby="settlement-title"
    >
      <div
        id="settlement-title"
        className="flex items-center gap-2 text-sm text-white/70 mb-3 font-medium"
      >
        <Clock4 className="w-4 h-4 opacity-70" />
        Выплаты
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60 text-sm">
          Нет запланированных выплат.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((i) => (
            <div
              key={i.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition"
            >
              <div className="min-w-0">
                <div className="text-white font-medium truncate">{i.title}</div>
                <div className="text-xs text-white/60 mt-0.5 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3 opacity-60" />
                  Каденс: <span className="text-white/80 ml-1">{i.cadence}</span>
                </div>
              </div>

              <div className="text-sm text-white/70 flex items-center gap-1">
                Последняя:
                <span className="text-white font-medium ml-1">{i.last}</span>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-white/90 text-black px-3 py-2 text-sm font-medium w-full sm:w-max hover:bg-white focus:ring-2 focus:ring-white/30 transition"
          >
            <RefreshCcw className="w-4 h-4" />
            Обновить данные
          </button>
        </div>
      )}
    </section>
  );
}