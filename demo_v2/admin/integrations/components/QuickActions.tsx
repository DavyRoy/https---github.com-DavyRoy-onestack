"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

type ActionItem = {
  title: string;
  desc: string;
  href: string;
  color: string; // tailwind gradient, e.g. "from-emerald-400/40 to-emerald-300/20"
};

export default function QuickActions() {
  const items: ActionItem[] = [
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

  const reduce = useReducedMotion();
  const anim = reduce
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  return (
    <motion.section
      {...anim}
      aria-label="Быстрые действия по интеграциям"
      className="admin-section grid gap-3 border-white/12 bg-white/8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((it) => (
        <Link
          key={it.title}
          href={it.href}
          aria-label={`${it.title}. ${it.desc}`}
          className={`
            group relative overflow-hidden
            rounded-2xl border border-white/12
            bg-white/10 p-4 sm:p-5
            hover:bg-white/16 hover:border-white/20
            transition-all duration-200 ease-out
            flex flex-col justify-between
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
          `}
        >
          {/* подсветка фона */}
          <div
            aria-hidden="true"
            className={`
              pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
              bg-gradient-to-br ${it.color} blur-xl transition-opacity
            `}
          />

          {/* контент */}
          <div className="relative z-10">
            <div className="text-xs text-white/60 tracking-wide">Быстрое действие</div>
            <div className="mt-1 font-medium text-base text-white break-words">{it.title}</div>
            <div className="mt-1 text-sm text-white/60 break-words">{it.desc}</div>
          </div>

          {/* стрелка */}
          <div className="relative z-10 mt-3 flex items-center gap-1 text-sm text-white/70 group-hover:text-white transition-colors">
            <span>Перейти</span>
            <ArrowRight
              size={14}
              className="translate-x-0 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </div>
        </Link>
      ))}
    </motion.section>
  );
}