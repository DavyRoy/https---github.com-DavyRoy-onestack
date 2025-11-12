"use client";
import Link from "next/link";

export default function SettingsHero() {
  return (
    <section
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 sm:p-5 md:p-6 w-full max-w-full min-w-0
      "
    >
      <div
        className="
          flex flex-col md:flex-row md:items-center md:justify-between gap-3
        "
      >
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight break-words">
            Системные настройки организации
          </h1>
          <p className="text-sm text-white/70 mt-1 max-w-prose">
            Бизнес-данные, налоги, валюты и брендинг для всей компании.
          </p>
        </div>

        <div className="flex w-full md:w-auto">
          <Link
            href="/demo/admin/reports"
            className="
              w-full md:w-auto
              text-center
              rounded-lg border border-white/15
              px-3 py-2 text-sm
              hover:bg-white/[0.08]
              transition
              focus:outline-none focus:ring-2 focus:ring-white/30
            "
          >
            Открыть аудит / отчёты
          </Link>
        </div>
      </div>
    </section>
  );
}