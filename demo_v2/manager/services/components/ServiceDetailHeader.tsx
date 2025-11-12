"use client";

import Link from "next/link";
import PriceBadge from "./PriceBadge";
import DurationBadge from "./DurationBadge";
import { Clipboard, CalendarDays } from "lucide-react";

export default function ServiceDetailHeader({
  id,
  title,
  category,
  status,
  price,
  duration,
}: {
  id: string;
  title: string;
  category: string;
  status: "active" | "inactive";
  price: number;
  duration: number;
}) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.info("✅ Ссылка скопирована:", window.location.href);
    } catch (err) {
      console.error("❌ Не удалось скопировать ссылку", err);
      alert("Не удалось скопировать ссылку");
    }
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* Левая часть */}
        <div>
          <div className="text-xs text-white/70">
            Услуги / {labelCat(category)} /
          </div>
          <h1 className="mt-1 text-xl md:text-2xl font-semibold">
            {title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <PriceBadge value={price} />
            <DurationBadge min={duration} />
            <span
              className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs ${
                status === "active"
                  ? "border-emerald-400/40 text-emerald-200"
                  : "border-white/20 text-white/70"
              }`}
            >
              {status === "active" ? "Активна" : "Скрыта"}
            </span>
          </div>
        </div>

        {/* Правая часть: действия */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/demo/manager/booking/new?service=${id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            <CalendarDays width={16} height={16} />
            Записать клиента
          </Link>

          <Link
            href={`/demo/manager/services/schedule?service=${id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Открыть календарь
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            <Clipboard width={14} height={14} />
            Поделиться
          </button>
        </div>
      </div>
    </div>
  );
}

/** Лейблы для категорий */
function labelCat(c: string) {
  switch (c) {
    case "hair":
      return "Волосы";
    case "nails":
      return "Ногти";
    case "spa":
      return "SPA";
    case "brows":
      return "Брови";
    case "massage":
      return "Массаж";
    default:
      return c || "Без категории";
  }
}