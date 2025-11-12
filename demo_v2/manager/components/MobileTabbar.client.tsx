// app/demo/manager/components/MobileTabbar.client.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo, useRef, useEffect } from "react";
import { IconLazy } from "@/app/demo/(shared)/components/icon-loader";

type Tab = { label: string; href: string; icon: string };

const TABS: Tab[] = [
  { href: "/demo/manager/dashboard", label: "Дашборд", icon: "layout-grid" },
  { href: "/demo/manager/crm", label: "CRM", icon: "users-2" },
  { href: "/demo/manager/crm/leads", label: "Лиды", icon: "workflow" },
  { href: "/demo/manager/crm/deals", label: "Сделки", icon: "clipboard-list" },
  { href: "/demo/manager/crm/clients", label: "Клиенты", icon: "users-2" }, // ✅ исправлено
  { href: "/demo/manager/orders", label: "Заказы", icon: "receipt" },
  { href: "/demo/manager/booking", label: "Бронь", icon: "calendar-days" },
  { href: "/demo/manager/services", label: "Услуги", icon: "pin" },
  { href: "/demo/manager/calendar", label: "Календарь", icon: "calendar" },
  { href: "/demo/manager/payments", label: "Платежи", icon: "credit-card" },
  { href: "/demo/manager/reports", label: "Отчёты", icon: "file-bar-chart-2" },
  { href: "/demo/manager/settings", label: "Настройки", icon: "settings" },
];

function uniqByHref(items: Tab[]) {
  const seen = new Set<string>();
  return items.filter((t) => {
    if (seen.has(t.href)) return false;
    seen.add(t.href);
    return true;
  });
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function MobileTabbarInner() {
  const pathname = usePathname();
  const tabs = useMemo(() => uniqByHref(TABS), []);
  const railRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Автопрокрутка к активному табу
  useEffect(() => {
    const active = tabs.find((t) => isActive(pathname, t.href));
    if (active) {
      const key = `${active.href}::${active.label}`;
      btnRefs.current[key]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [pathname, tabs]);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/12 bg-[#050910]/85 backdrop-blur-xl sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="navigation"
      aria-label="Нижнее меню менеджера"
    >
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/60 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/60 to-transparent" />

        <div
          ref={railRef}
          className={cn(
            "grid auto-cols-[minmax(120px,1fr)] grid-flow-col content-center gap-2 overflow-x-auto px-2 py-2",
            "snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
          )}
        >
          <div className="w-1" aria-hidden />
          {tabs.map((t) => {
            const active = isActive(pathname, t.href);
            const key = `${t.href}::${t.label}`;
            return (
              <Link
                key={key}
                ref={(el) => (btnRefs.current[key] = el)}
                href={t.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 snap-start items-center gap-2 rounded-2xl border px-3 text-left transition",
                  "border-white/12 bg-white/10 hover:border-white/16 hover:bg-white/16 active:scale-[0.98]",
                  active && "border-white/20 bg-white/16 shadow-[0_0_0_1px_rgba(255,255,255,0.14)_inset]"
                )}
              >
                <IconLazy name={t.icon} aria-hidden size={18} />
                <span className="min-w-0 leading-4">
                  <span className="block truncate text-xs text-white">{t.label}</span>
                  <span className="block truncate text-[10px] uppercase tracking-wide text-white/60">
                    Менеджер
                  </span>
                </span>
                {active && <span className="ml-auto inline-block h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden />}
              </Link>
            );
          })}
          <div className="w-1" aria-hidden />
        </div>

        <div className="px-2 pb-1">
          <div className="h-px w-full rounded bg-white/10" aria-hidden />
        </div>
      </div>
    </div>
  );
}

const MobileTabbar = memo(MobileTabbarInner);
export default MobileTabbar;