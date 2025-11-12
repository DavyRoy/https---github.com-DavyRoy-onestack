"use client";

import { useState, useEffect } from "react";
import * as Lucide from "lucide-react";
import { ADMIN_BUNDLES } from "@/app/demo/(shared)/data/services";

type Bundle = typeof ADMIN_BUNDLES[number];
type Status = "active" | "draft" | "archived";
type Type = "package" | "subscription";

export default function BundleForm({ initial }: { initial?: Bundle }) {
  const [type, setType] = useState<Type>(initial?.type || "package");
  const [name, setName] = useState(initial?.name || "");
  const [status, setStatus] = useState<Status>(initial?.status || "draft");

  // автоимя для новых пакетов
  useEffect(() => {
    if (!initial && !name) {
      setName(type === "package" ? "Новый пакет" : "Новый абонемент");
    }
  }, [type, name, initial]);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 grid gap-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lucide.Package className="h-5 w-5 opacity-70" />
          <h2 className="text-sm font-medium">Основная информация</h2>
        </div>
        <span
          className={`rounded-lg px-2 py-0.5 text-xs uppercase tracking-wide ${
            status === "active"
              ? "bg-emerald-400/15 text-emerald-300"
              : status === "archived"
              ? "bg-white/10 text-white/70"
              : "bg-amber-400/15 text-amber-300"
          }`}
        >
          {status}
        </span>
      </header>

      {/* Тип и название */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 sm:col-span-1">
          <span className="text-xs opacity-70 flex items-center gap-1">
            Тип
            <Lucide.Info className="h-3.5 w-3.5 opacity-50" title="Пакет — фиксированное количество услуг. Абонемент — действует по времени." />
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Type)}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
          >
            <option value="package">Пакет</option>
            <option value="subscription">Абонемент</option>
          </select>
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs opacity-70">Название</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === "package" ? "Например: SPA Weekend" : "Безлимит 30 дней"}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
          />
        </label>
      </div>

      {/* Статус */}
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="grid gap-1 sm:col-span-1">
          <span className="text-xs opacity-70 flex items-center gap-1">
            Статус
            <Lucide.HelpCircle className="h-3.5 w-3.5 opacity-50" title="Черновик — неактивен, Активен — доступен клиентам, Архив — скрыт." />
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
          >
            <option value="draft">Черновик</option>
            <option value="active">Активен</option>
            <option value="archived">Архив</option>
          </select>
        </label>

        <div className="sm:col-span-2 text-xs text-white/60 flex items-center gap-2">
          {type === "subscription" ? (
            <>
              <Lucide.Clock className="h-4 w-4 opacity-60" />
              Абонемент требует указания периода действия (30, 90 дней и т.п.)
            </>
          ) : (
            <>
              <Lucide.Layers className="h-4 w-4 opacity-60" />
              Пакет содержит несколько услуг с фиксированным количеством.
            </>
          )}
        </div>
      </div>
    </section>
  );
}