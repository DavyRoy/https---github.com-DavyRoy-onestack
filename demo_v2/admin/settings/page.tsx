"use client";

import Link from "next/link";
import SettingsHero from "./components/SettingsHero";

export default function AdminSettingsHubPage() {
  const cards = [
    {
      href: "/demo/admin/settings/business",
      title: "Бизнес",
      desc: "Организация, локации, реквизиты",
    },
    {
      href: "/demo/admin/settings/taxes",
      title: "Локализация и налоги",
      desc: "Ставки, правила, языки",
    },
    {
      href: "/demo/admin/settings/currency",
      title: "Валюта и форматы",
      desc: "Базовая валюта, курсы, формат",
    },
    {
      href: "/demo/admin/settings/branding",
      title: "Брендинг и тема",
      desc: "Логотип, цвета, предпросмотр",
    },
  ];

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
      aria-labelledby="settings-hub-title"
    >
      <SettingsHero />

      {/* Карточки настроек */}
      <section
        className="
          grid gap-3 sm:grid-cols-2 lg:grid-cols-4
          min-w-0
        "
        aria-label="Разделы настроек"
      >
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="
              group rounded-2xl border border-white/15
              bg-white/[0.05] p-4 sm:p-5
              hover:bg-white/[0.08] hover:border-white/20
              transition
              flex flex-col justify-between min-w-0
              focus:outline-none focus:ring-2 focus:ring-white/30
            "
            aria-label={`${c.title} — ${c.desc}. Открыть`}
          >
            <div className="min-w-0">
              <div className="text-base font-medium text-white/90 break-words">
                {c.title}
              </div>
              <p className="text-sm text-white/70 mt-1 leading-snug break-words">
                {c.desc}
              </p>
            </div>
            <span className="mt-3 inline-block text-xs text-white/60 group-hover:text-white/80 transition-colors">
              → Перейти
            </span>
          </Link>
        ))}
      </section>

      {/* Нижний блок */}
      <section
        className="
          flex flex-col sm:flex-row sm:items-center sm:justify-between
          gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4
          min-w-0
        "
        aria-label="Быстрая навигация к отчётам"
      >
        <div className="text-sm text-white/80">
          Нужен аудит изменений?
          <div className="text-xs text-white/50 mt-1 sm:hidden">
            Проверяйте активность и отчёты прямо из панели.
          </div>
        </div>
        <Link
          href="/demo/admin/reports"
          className="
            w-full sm:w-auto text-center
            rounded-lg border border-white/15
            px-3 py-2 text-sm
            hover:bg-white/[0.08] transition
          "
        >
          Открыть отчёты
        </Link>
      </section>
    </div>
  );
}