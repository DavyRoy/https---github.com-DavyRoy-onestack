"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus, CalendarPlus, CalendarX2, UploadCloud } from "lucide-react";

export type QuickActionItem = {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
};

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function QuickActions({
  items,
  className = "",
}: {
  items?: QuickActionItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const DEFAULT_ITEMS: QuickActionItem[] = [
    {
      title: "Добавить ресурс",
      href: `${base}/booking/schedules/resources/new`,
      description: "Мастер, зал, стол или номер",
      icon: <UserPlus width={16} height={16} aria-hidden="true" />,
    },
    {
      title: "Создать шаблон",
      href: `${base}/booking/schedules/templates/new`,
      description: "Повторяющиеся слоты расписания",
      icon: <CalendarPlus width={16} height={16} aria-hidden="true" />,
    },
    {
      title: "Добавить исключение",
      href: `${base}/booking/schedules/exceptions/new`,
      description: "Праздники, ремонт, блэкаут",
      icon: <CalendarX2 width={16} height={16} aria-hidden="true" />,
    },
    {
      title: "Импорт расписания (демо)",
      href: `${base}/booking/schedules?import=1`,
      description: "Загрузка из CSV/XLSX",
      icon: <UploadCloud width={16} height={16} aria-hidden="true" />,
    },
  ];

  const safe: QuickActionItem[] = React.useMemo(() => {
    if (!items) return DEFAULT_ITEMS;
    return Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS;
  }, [items, base]); // base включён, чтобы пути пересчитывались при смене роли

  return (
    <section
      className={`admin-section border-white/12 bg-white/8 ${className}`}
      aria-labelledby="booking-qa-title"
    >
      <div id="booking-qa-title" className="text-sm font-medium mb-3">
        Быстрые действия
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4" role="list">
        {safe.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            prefetch={false}
            className="group rounded-xl border border-white/15 bg-white/[0.06] p-3 transition hover:bg-white/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label={it.title}
            role="listitem"
          >
            <div className="flex items-center gap-2">
              {it.icon && <span className="opacity-80">{it.icon}</span>}
              <span className="text-sm font-medium">{it.title}</span>
            </div>

            {it.description && (
              <div className="mt-1 text-xs text-white/60">{it.description}</div>
            )}

            <div className="mt-2 text-[11px] text-white/50 group-hover:text-white/70">
              Открыть →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}