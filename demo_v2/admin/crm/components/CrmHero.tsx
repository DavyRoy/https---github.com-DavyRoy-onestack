"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Workflow, Layers } from "lucide-react";

export default function CrmHero() {
  return (
    <header className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 md:p-6 backdrop-blur-sm shadow-sm">
      {/* Основной заголовок */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          CRM-панель администратора
        </h1>
        <p className="text-white/70 mt-1 max-w-2xl text-sm md:text-base">
          Управление клиентами, источниками, воронками и сегментами — всё в одном месте.
        </p>
      </motion.div>

      {/* Навигационные кнопки */}
      <motion.nav
        className="mt-4 flex flex-wrap gap-2 text-sm md:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <NavLink
          href="/demo/admin/crm/clients"
          label="Клиенты"
          icon={<Users size={16} className="opacity-80" />}
        />
        <NavLink
          href="/demo/admin/crm/pipelines"
          label="Источники и воронки"
          icon={<Workflow size={16} className="opacity-80" />}
        />
        <NavLink
          href="/demo/admin/crm/segments"
          label="Сегменты"
          icon={<Layers size={16} className="opacity-80" />}
        />
      </motion.nav>
    </header>
  );
}

/* ——— Вспомогательный компонент для кнопок ——— */
function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/[0.07] hover:border-white/25 transition text-white/90"
      title={label}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}