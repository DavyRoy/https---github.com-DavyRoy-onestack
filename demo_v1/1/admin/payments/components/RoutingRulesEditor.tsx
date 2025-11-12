"use client";
import React from "react";
import { Settings2, CheckCircle } from "lucide-react";

export default function RoutingRulesEditor() {
  const [rules, setRules] = React.useState([
    { id: "r1", cond: "KRW • card", route: "K-Pay 100%" },
    { id: "r2", cond: "RUB • card (AOV<20k)", route: "DemoPay 80% / AltPay 20%" },
  ]);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
        <Settings2 className="w-4 h-4 opacity-70" />
        Маршрутизация
      </div>

      <div className="grid gap-3">
        {rules.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-white/[0.06] transition"
          >
            <div className="min-w-0">
              <div className="font-medium truncate text-white">{r.cond}</div>
              <div className="text-xs text-white/60">{r.route}</div>
            </div>
            <button
              onClick={() => alert("Редактирование — демо")}
              className="text-xs underline text-white/70 hover:text-white"
            >
              Изменить
            </button>
          </div>
        ))}

        <button
          onClick={() => alert("Валидировано (демо)")}
          className="mt-1 flex items-center gap-2 rounded-lg bg-white/90 text-black px-3 py-2 text-sm w-full sm:w-max hover:bg-white transition"
        >
          <CheckCircle className="w-4 h-4" />
          Валидировать правила
        </button>
      </div>
    </section>
  );
}