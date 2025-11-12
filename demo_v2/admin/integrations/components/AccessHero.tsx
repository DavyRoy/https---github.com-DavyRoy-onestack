// app/demo/admin/integrations/components/AccessHero.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function AccessHero() {
  return (
    <section
      className="
        rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-6
        backdrop-blur-sm w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Верхний блок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold break-words">
            Интеграции и каналы
          </h1>
          <p className="text-sm text-white/70 mt-1 leading-snug">
            Управляйте подключёнными сервисами, API-каналами и вебхуками. Следите за
            статусом и журналами доставки событий.
          </p>
        </div>

        {/* Кнопки действий */}
        <div
          className="
            flex flex-wrap gap-2 w-full sm:w-auto
            [&>*]:flex-1 [&>*]:text-center sm:[&>*]:flex-none
          "
        >
          <Link
            href="/demo/admin/integrations/channels"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
          >
            Каналы
          </Link>
          <Link
            href="/demo/admin/integrations/catalog"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
          >
            Каталог
          </Link>
          <Link
            href="/demo/admin/integrations/webhooks"
            className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
          >
            Вебхуки
          </Link>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div
        className="
          mt-4 grid gap-3
          sm:grid-cols-2 lg:grid-cols-4
          min-w-0
        "
      >
        <Link
          href="/demo/admin/integrations/catalog"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Подключение</div>
          <div className="font-medium mt-1 break-words">
            Открыть каталог интеграций
          </div>
        </Link>

        <Link
          href="/demo/admin/integrations/channels"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Мониторинг</div>
          <div className="font-medium mt-1 break-words">
            Активные каналы
          </div>
        </Link>

        <Link
          href="/demo/admin/integrations/webhooks"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Автоматизация</div>
          <div className="font-medium mt-1 break-words">
            Настроить вебхуки
          </div>
        </Link>

        <Link
          href="/demo/admin/integrations/deliveries"
          className="rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition"
        >
          <div className="text-xs text-white/60">Журналы</div>
          <div className="font-medium mt-1 break-words">
            Проверить доставки событий
          </div>
        </Link>
      </div>
    </section>
  );
}