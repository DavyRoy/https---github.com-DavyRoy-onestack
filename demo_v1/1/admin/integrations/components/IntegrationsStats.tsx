"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CHANNEL_STATS } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsChannels";
import { WEBHOOK_STATS } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsWebhooks";

export default function IntegrationsStats() {
  const items = [
    {
      label: "Подключено каналов",
      value: CHANNEL_STATS.connected,
      href: "/demo/admin/integrations/channels",
      color: "from-emerald-400/40 to-emerald-300/20",
    },
    {
      label: "Активных вебхуков",
      value: 3,
      href: "/demo/admin/integrations/webhooks",
      color: "from-sky-400/40 to-sky-300/20",
    },
    {
      label: "Доставок за 24ч",
      value: WEBHOOK_STATS.delivered24h,
      href: "/demo/admin/integrations/webhooks?range=24h",
      color: "from-indigo-400/40 to-indigo-300/20",
    },
    {
      label: "Ошибок за 1ч",
      value: 4,
      href: "/demo/admin/integrations/webhooks?status=failed&range=1h",
      color: "from-rose-400/40 to-rose-300/20",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        grid gap-3 sm:grid-cols-2 lg:grid-cols-4
        w-full max-w-full overflow-x-hidden
      "
    >
      {items.map((it, i) => (
        <Link
          key={it.label}
          href={it.href}
          className={`
            group relative overflow-hidden rounded-2xl border border-white/15
            bg-white/[0.05] p-4 sm:p-5
            hover:bg-white/[0.08] hover:border-white/20
            transition-all duration-200 ease-out
          `}
        >
          {/* фон градиента при ховере */}
          <div
            className={`
              absolute inset-0 opacity-0 group-hover:opacity-100
              bg-gradient-to-br ${it.color} blur-xl transition-opacity
            `}
          />

          {/* контент */}
          <div className="relative">
            <div className="text-xs text-white/60 tracking-wide">
              {it.label}
            </div>
            <div className="text-2xl sm:text-3xl font-semibold mt-1">
              {it.value.toLocaleString("ru-RU")}
            </div>
          </div>
        </Link>
      ))}
    </motion.section>
  );
}