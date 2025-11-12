"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, UserPlus, Activity, AlertTriangle } from "lucide-react";
import { ADMIN_CRM_META } from "@/app/demo/(shared)/crm/data/clients.demo";

export default function CrmStats() {
  const cards = [
    {
      title: "Всего клиентов",
      value: ADMIN_CRM_META.total,
      href: "/demo/admin/crm/clients",
      icon: <Users size={18} />,
      color: "from-emerald-400/30 to-emerald-600/20",
    },
    {
      title: "Новых за 30д",
      value: ADMIN_CRM_META.new30d,
      href: "/demo/admin/crm/clients?created=30d",
      icon: <UserPlus size={18} />,
      color: "from-sky-400/30 to-sky-600/20",
    },
    {
      title: "Активных за 30д",
      value: ADMIN_CRM_META.active30d,
      href: "/demo/admin/crm/clients?active=30d",
      icon: <Activity size={18} />,
      color: "from-amber-400/30 to-amber-600/20",
    },
    {
      title: "Отток >90д",
      value: ADMIN_CRM_META.churn90d,
      href: "/demo/admin/crm/clients?churn=90d",
      icon: <AlertTriangle size={18} />,
      color: "from-rose-400/30 to-rose-600/20",
    },
  ];

  return (
    <motion.section
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <Link
            href={c.href}
            className={`group relative block rounded-2xl border border-white/15 bg-gradient-to-br ${c.color} p-4 md:p-5 hover:from-white/[0.15] hover:to-white/[0.08] transition-all duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">{c.title}</div>
              <div className="text-white/60 group-hover:text-white transition">{c.icon}</div>
            </div>
            <div className="text-3xl font-semibold mt-2 group-hover:text-white transition-colors">
              {c.value.toLocaleString("ru-RU")}
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.section>
  );
}