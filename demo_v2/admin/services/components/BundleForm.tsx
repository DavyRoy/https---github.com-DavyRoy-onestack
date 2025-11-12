// app/demo/admin/services/components/BundleForm.tsx
"use client";

import { useEffect, useId, useState } from "react";
import * as Lucide from "lucide-react";
import { ADMIN_BUNDLES } from "@/app/demo/(shared)/data/services";

type Bundle = (typeof ADMIN_BUNDLES)[number];
type Status = "active" | "draft" | "archived";
type Type = "package" | "subscription";

function toneByStatus(s: Status) {
  switch (s) {
    case "active":
      return "bg-emerald-400/15 text-emerald-300";
    case "archived":
      return "bg-white/10 text-white/70";
    default:
      return "bg-amber-400/15 text-amber-300";
  }
}

export default function BundleForm({ initial }: { initial?: Bundle }) {
  const autoId = useId();
  const nameId = `${autoId}-name`;
  const typeId = `${autoId}-type`;
  const statusId = `${autoId}-status`;
  const nameHintId = `${autoId}-name-hint`;
  const statusHintId = `${autoId}-status-hint`;
  const typeHintId = `${autoId}-type-hint`;

  const [type, setType] = useState<Type>(initial?.type || "package");
  const [name, setName] = useState(initial?.name || "");
  const [status, setStatus] = useState<Status>(initial?.status || "draft");

  // Автозаполнение имени для НОВЫХ пакетов/абонементов — только при смене типа и если поле пустое
  useEffect(() => {
    if (!initial && !name.trim()) {
      setName(type === "package" ? "Новый пакет" : "Новый абонемент");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const nameTooLong = name.length > 120;

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 grid gap-4"
      aria-labelledby={`${autoId}-title`}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Lucide.Package className="h-5 w-5 opacity-70 shrink-0" aria-hidden="true" />
          <h2 id={`${autoId}-title`} className="text-sm font-medium">
            Основная информация
          </h2>
        </div>

        <span
          className={`rounded-lg px-2 py-0.5 text-xs uppercase tracking-wide tabular-nums ${toneByStatus(
            status
          )}`}
          title="Текущий статус"
        >
          {status}
        </span>
      </header>

      {/* Тип и название */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-1 sm:col-span-1">
          <span className="text-xs opacity-70 flex items-center gap-1">
            Тип
            <Lucide.Info
              className="h-3.5 w-3.5 opacity-50"
              aria-hidden="true"
            />
          </span>
          <select
            id={typeId}
            aria-describedby={typeHintId}
            value={type}
            onChange={(e) => setType(e.target.value as Type)}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
          >
            <option value="package">Пакет</option>
            <option value="subscription">Абонемент</option>
          </select>
          <span id={typeHintId} className="text-[11px] text-white/60">
            Пакет — фиксированное количество услуг. Абонемент — действует по времени.
          </span>
        </label>

        <label className="grid gap-1 sm:col-span-2">
          <span className="text-xs opacity-70">Название</span>
          <input
            id={nameId}
            aria-describedby={nameHintId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === "package" ? "Например: SPA Weekend" : "Безлимит 30 дней"}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
            maxLength={120}
            required
          />
          <div id={nameHintId} className="flex items-center justify-between text-[11px] text-white/60">
            <span>Отображается в списках и на витрине.</span>
            <span className={nameTooLong ? "text-amber-300" : ""}>{name.length}/120</span>
          </div>
        </label>
      </div>

      {/* Статус */}
      <div className="grid sm:grid-cols-3 gap-3">
        <label className="grid gap-1 sm:col-span-1">
          <span className="text-xs opacity-70 flex items-center gap-1">
            Статус
            <Lucide.HelpCircle className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
          </span>
          <select
            id={statusId}
            aria-describedby={statusHintId}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-white/20"
          >
            <option value="draft">Черновик</option>
            <option value="active">Активен</option>
            <option value="archived">Архив</option>
          </select>
          <span id={statusHintId} className="text-[11px] text-white/60">
            Черновик — неактивен, Активен — доступен клиентам, Архив — скрыт.
          </span>
        </label>

        <div className="sm:col-span-2 text-xs text-white/60 flex items-center gap-2">
          {type === "subscription" ? (
            <>
              <Lucide.Clock className="h-4 w-4 opacity-60" aria-hidden="true" />
              Абонемент требует указания периода действия (30, 90 дней и т.п.).
            </>
          ) : (
            <>
              <Lucide.Layers className="h-4 w-4 opacity-60" aria-hidden="true" />
              Пакет содержит несколько услуг с фиксированным количеством.
            </>
          )}
        </div>
      </div>
    </section>
  );
}