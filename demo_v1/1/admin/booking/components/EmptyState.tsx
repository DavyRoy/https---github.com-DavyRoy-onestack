"use client";

import Link from "next/link";
import { FolderOpen, PlusCircle } from "lucide-react";

export default function EmptyState() {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 text-center flex flex-col items-center justify-center">
      <FolderOpen className="w-10 h-10 text-white/40 mb-3" aria-hidden="true" />

      <h2 className="text-lg md:text-xl font-semibold text-white/90">
        Нет данных
      </h2>
      <p className="text-sm text-white/70 mt-1 max-w-sm">
        Добавьте ресурс или создайте шаблон расписания, чтобы начать работу с
        бронированием.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link
          href="/demo/admin/booking/schedules/resources/new"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Добавить ресурс</span>
        </Link>

        <Link
          href="/demo/admin/booking/schedules/templates/new"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white px-4 py-2 text-sm text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-black/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Создать шаблон</span>
        </Link>
      </div>
    </section>
  );
}