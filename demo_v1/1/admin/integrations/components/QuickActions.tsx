"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function QuickActions() {
  const items = [
    {
      title: "Подключить канал",
      desc: "Email, SMS, мессенджеры",
      href: "/demo/admin/integrations/channels",
      color: "from-emerald-400/40 to-emerald-300/20",
    },
    {
      title: "Добавить вебхук",
      desc: "Передача событий и аналитики",
      href: "/demo/admin/integrations/webhooks",
      color: "from-sky-400/40 to-sky-300/20",
    },
    {
      title: "Открыть каталог",
      desc: "Готовые коннекторы и API",
      href: "/demo/admin/integrations/catalog",
      color: "from-indigo-400/40 to-indigo-300/20",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((it) => (
        <Link
          key={it.title}
          href={it.href}
          className={`
            group relative overflow-hidden
            rounded-2xl border border-white/15
            bg-white/[0.05] p-4 sm:p-5
            hover:bg-white/[0.08] hover:border-white/25
            transition-all duration-200 ease-out
            flex flex-col justify-between
          `}
        >
          {/* подсветка фона */}
          <div
            className={`
              absolute inset-0 opacity-0 group-hover:opacity-100
              bg-gradient-to-br ${it.color} blur-xl transition-opacity
            `}
          />

          {/* контент */}
          <div className="relative z-10">
            <div className="text-xs text-white/60 tracking-wide">
              Быстрое действие
            </div>
            <div className="font-medium text-base mt-1 text-white">
              {it.title}
            </div>
            <div className="text-sm text-white/60 mt-1">{it.desc}</div>
          </div>

          {/* стрелка */}
          <div className="relative z-10 mt-3 flex items-center gap-1 text-sm text-white/70 group-hover:text-white transition-colors">
            <span>Перейти</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </Link>
      ))}
    </motion.section>
  );
}