// app/demo/admin/integrations/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import IntegrationsHero from "./components/IntegrationsHero";
import IntegrationsStats from "./components/IntegrationsStats";
import QuickActions from "./components/QuickActions";

export default function AdminIntegrationsHub() {
  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      <IntegrationsHero />
      <IntegrationsStats />
      <QuickActions />

      {/* Быстрые ссылки для узких экранов */}
      <nav className="grid grid-cols-2 gap-2 sm:hidden" aria-label="Быстрые ссылки по разделам интеграций">
        <Link
          href="/demo/admin/integrations/channels"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-center text-sm"
        >
          Каналы
        </Link>
        <Link
          href="/demo/admin/integrations/webhooks"
          className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-center text-sm"
        >
          Вебхуки
        </Link>
      </nav>
    </div>
  );
}