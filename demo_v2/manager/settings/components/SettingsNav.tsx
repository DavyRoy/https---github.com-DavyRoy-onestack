"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/demo/manager/settings/profile", label: "Профиль" },
  { href: "/demo/manager/settings/notifications", label: "Уведомления" },
  { href: "/demo/manager/settings/calendar", label: "Календарь" },
  { href: "/demo/manager/settings/preferences", label: "Предпочтения" },
  { href: "/demo/manager/settings/payments", label: "Оплата" },
  { href: "/demo/manager/settings/integrations", label: "Интеграции" },
  { href: "/demo/manager/settings/saved-views", label: "Сохранённые виды" },
  { href: "/demo/manager/settings/security", label: "Безопасность" },
];

export default function SettingsNav() {
  const path = usePathname();
  return (
    <aside className="rounded-2xl border border-white/15 bg-white/[0.05] p-2 md:p-3 backdrop-blur-sm">
      <nav className="grid">
        {NAV.map(i => {
          const active = path.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              className={
                "rounded-lg px-3 py-2 text-sm hover:bg-white/[0.08] " +
                (active ? "bg-white text-black" : "text-white")
              }
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}