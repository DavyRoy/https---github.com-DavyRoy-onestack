"use client";

import React from "react";
import { AlertCircle, Inbox } from "lucide-react"; // иконки shadcn/lucide

type Props = {
  title?: string;
  hint?: string;
  type?: "empty" | "error" | "search"; // варианты состояния
};

export default function EmptyState({
  title = "Пусто",
  hint = "Нет данных для отображения.",
  type = "empty",
}: Props) {
  const icon =
    type === "error" ? (
      <AlertCircle className="w-8 h-8 text-rose-400" />
    ) : (
      <Inbox className="w-8 h-8 text-white/50" />
    );

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-8 md:p-10 text-center flex flex-col items-center justify-center gap-2">
      <div>{icon}</div>
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="text-sm text-white/60 max-w-[300px]">{hint}</div>
    </div>
  );
}