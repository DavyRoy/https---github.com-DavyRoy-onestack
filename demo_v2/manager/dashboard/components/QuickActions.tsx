"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import { Plus, ClipboardList, CalendarPlus, BarChart3 } from "lucide-react";

/**
 * Быстрые действия менеджера — универсальные CTA для CRM, заказов и бронирования.
 * Адаптировано под mobile-first дизайн и согласовано со стилями других карточек.
 */
export default function QuickActions() {
  const actions = [
    {
      href: "/demo/manager/crm/leads/new",
      label: "Создать лид",
      icon: Plus,
    },
    {
      href: "/demo/manager/orders/new",
      label: "Создать заказ",
      icon: ClipboardList,
    },
    {
      href: "/demo/manager/booking/new",
      label: "Записать клиента",
      icon: CalendarPlus,
    },
    {
      href: "/demo/manager/reports?slice=7d",
      label: "Отчёт 7 дней",
      icon: BarChart3,
    },
  ];

  return (
    <section className={T.soft + " grid gap-3"}>
      <div className="text-sm font-medium text-white/90">
        Быстрые действия
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className={
                T.btn +
                " inline-flex items-center gap-2 transition focus-visible:ring-2 focus-visible:ring-white/30"
              }
              aria-label={a.label}
            >
              <Icon width={16} height={16} aria-hidden />
              {a.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}