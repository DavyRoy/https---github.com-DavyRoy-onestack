"use client";

import Link from "next/link";
import { FolderOpen, PlusCircle } from "lucide-react";

/**
 * Универсальное состояние "Нет данных" для разделов бронирования.
 * Отображается, когда отсутствуют ресурсы, шаблоны или другие сущности.
 */
export default function EmptyState() {
  return (
    <section className="admin-section flex flex-col items-center justify-center text-center border-white/15 bg-white/[0.04] p-6 md:p-8">
      <FolderOpen
        className="h-10 w-10 text-white/40 mb-3 md:mb-4"
        aria-hidden="true"
      />

      <h2 className="text-lg md:text-xl font-semibold text-white/90">
        Нет данных
      </h2>

      <p className="mt-1 text-sm text-white/70 max-w-sm">
        Добавьте ресурс или создайте шаблон расписания, чтобы начать работу с
        системой бронирования.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          href="/demo/admin/booking/schedules/resources/new"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Добавить новый ресурс"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Добавить ресурс</span>
        </Link>

        <Link
          href="/demo/admin/booking/schedules/templates/new"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white px-4 py-2 text-sm text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label="Создать новый шаблон"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Создать шаблон</span>
        </Link>
      </div>
    </section>
  );
}