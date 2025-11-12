"use client";

import Link from "next/link";
import { ArrowRight, NotebookPen, Users2, Layers, Sparkles } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";

export default function CrmQuickActions() {
  const actions = [
    {
      href: "/demo/manager/crm/clients/new",
      label: "Создать клиента",
      icon: <Users2 width={18} height={18} aria-hidden />,
    },
    {
      href: "/demo/manager/crm/leads/new",
      label: "Создать лид",
      icon: <NotebookPen width={18} height={18} aria-hidden />,
    },
    {
      href: "/demo/manager/crm/deals/new",
      label: "Создать сделку",
      icon: <Layers width={18} height={18} aria-hidden />,
    },
  ];

  return (
    <section
      aria-labelledby="crm-quick-actions-title"
      className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:gap-3"
    >
      <h2 id="crm-quick-actions-title" className="sr-only">
        Быстрые действия CRM
      </h2>

      {actions.map((a) => (
        <ActionCard key={a.href} href={a.href} label={a.label} icon={a.icon} />
      ))}
    </section>
  );
}

/* ===== Вспомогательный подкомпонент ===== */
function ActionCard({
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
      className="
        group flex flex-1 items-center justify-between gap-3
        rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3
        text-sm text-white/90 transition
        hover:-translate-y-0.5 hover:bg-white/[0.12] hover:border-white/25
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
        will-change-transform
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="
            flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
            border border-white/15 bg-white/10 text-white/85
            transition group-hover:bg-white/15
          "
        >
          {icon}
        </span>
        <span className="truncate font-medium">{label}</span>
      </div>

      <ArrowRight
        width={16}
        height={16}
        className="text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white"
        aria-hidden
      />
    </Link>
  );
}