// app/demo/admin/payments/components/RoutingRulesEditor.tsx
"use client";

import * as React from "react";
import { Settings2, CheckCircle, PlusCircle } from "lucide-react";

export default function RoutingRulesEditor() {
  const [rules, setRules] = React.useState([
    { id: "r1", cond: "KRW • card", route: "K-Pay 100%" },
    { id: "r2", cond: "RUB • card (AOV<20k)", route: "DemoPay 80% / AltPay 20%" },
  ]);

  const addRule = () => {
    const cond = prompt("Введите условие маршрута (например: USD • card):");
    const route = prompt("Введите правило (например: MainPay 70% / AltPay 30%):");
    if (!cond || !route) return;
    const id = "r" + Math.random().toString(36).slice(2, 8);
    setRules((prev) => [...prev, { id, cond, route }]);
    alert("Новое правило добавлено (демо).");
  };

  const validateRules = () => {
    alert("Валидировано (демо)");
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="flex items-center gap-2 text-sm text-white/70 mb-3 font-medium">
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
              <div className="font-medium text-white truncate">{r.cond}</div>
              <div className="text-xs text-white/60">{r.route}</div>
            </div>
            <button
              onClick={() => alert("Редактирование — демо")}
              className="text-xs text-white/70 underline hover:text-white transition"
            >
              Изменить
            </button>
          </div>
        ))}

        {/* Действия */}
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={addRule}
            className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white/85 hover:bg-white/[0.08] transition"
          >
            <PlusCircle className="w-4 h-4" />
            Добавить правило
          </button>

          <button
            onClick={validateRules}
            className="flex items-center gap-2 rounded-lg bg-white/90 text-black px-3 py-2 text-sm font-medium hover:bg-white transition"
          >
            <CheckCircle className="w-4 h-4" />
            Валидировать правила
          </button>
        </div>
      </div>
    </section>
  );
}