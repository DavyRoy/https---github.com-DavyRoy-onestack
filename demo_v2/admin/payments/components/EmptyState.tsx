// app/demo/admin/payments/components/EmptyState.tsx
"use client";

import * as React from "react";
import { AlertCircle, Inbox, Search } from "lucide-react"; // Иконки shadcn/lucide

type Props = {
  title?: string;
  hint?: string;
  type?: "empty" | "error" | "search";
};

export default function EmptyState({
  title = "Пусто",
  hint = "Нет данных для отображения.",
  type = "empty",
}: Props) {
  const icon =
    type === "error" ? (
      <AlertCircle className="w-8 h-8 text-rose-400" aria-hidden="true" />
    ) : type === "search" ? (
      <Search className="w-8 h-8 text-sky-400" aria-hidden="true" />
    ) : (
      <Inbox className="w-8 h-8 text-white/50" aria-hidden="true" />
    );

  const bgClass =
    type === "error"
      ? "bg-rose-500/10 border-rose-500/30"
      : type === "search"
      ? "bg-sky-500/10 border-sky-500/20"
      : "bg-white/[0.03] border-white/15";

  return (
    <div
      className={`rounded-2xl border ${bgClass} p-8 md:p-10 text-center flex flex-col items-center justify-center gap-3 transition`}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <div>{icon}</div>
      <div className="text-lg font-semibold text-white">{title}</div>
      <p className="text-sm text-white/60 max-w-[300px]">{hint}</p>

      {type === "error" && (
        <button
          onClick={() => location.reload()}
          className="mt-2 px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/[0.06]"
        >
          Повторить попытку
        </button>
      )}
    </div>
  );
}